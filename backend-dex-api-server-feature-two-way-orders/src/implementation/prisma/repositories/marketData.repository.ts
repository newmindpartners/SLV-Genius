import {inject, injectable, singleton} from 'tsyringe';
import {Prisma} from '@prisma/client';
import {Decimal} from '@prisma/client/runtime';
import * as Private from '~/domain/models/private';
import {calcUnitMultiplier} from '~/domain/utils/asset.util';
import {Ohlc} from '~/implementation/client/maestro/maestro.client';
import {LoggerService} from '~/domain/services';
import {map} from 'lodash';
import {AssetRepository} from '~/domain/repositories';

@singleton()
@injectable()
export class MarketDataRepositoryPrisma {
  constructor(
    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository
  ) {}

  async getMarketAggPrice(
    prisma: Prisma.TransactionClient,
    assetPair: Private.AssetPair,
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval
  ): Promise<Private.TimeseriesAggPriceData[]> {
    const {
      seriesInterval,
      seriesStartTimeExpression,
      seriesEndTimeExpression,
      getBinIntervalExpression,
    } = this.getTimeseriesSqlParams(startTime, endTime, binInterval);

    const binIntervalExpression = getBinIntervalExpression(
      'transaction_date_fill'
    );

    const {
      baseAsset: {assetId: baseAssetId, decimalPrecision: baseAssetPrecision},
      quoteAsset: {
        assetId: quoteAssetId,
        decimalPrecision: quoteAssetPrecision,
      },
    } = assetPair;

    // Price in indivisible units does not equal price in display units when there is a difference between the asset display precision values.
    // This query specifically ensures that the price aggregate is represented in the display unit.
    const decimalPrecisionDiff = baseAssetPrecision - quoteAssetPrecision;
    const priceOperation = decimalPrecisionDiff > 0 ? '*' : '/';
    const decimalPrecisionDiffAbsolute = Math.abs(decimalPrecisionDiff);
    const unitPriceDiffMultiplier = calcUnitMultiplier(
      decimalPrecisionDiffAbsolute
    ).toString();

    const data: Private.TimeseriesAggPriceData[] =
      await prisma.$queryRaw(Prisma.sql`
      WITH time_bins AS (
        SELECT generate_series(
          ${Prisma.raw(seriesStartTimeExpression)},
          ${Prisma.raw(seriesEndTimeExpression)},
          ${seriesInterval}::interval
        ) as bin_timestamp
      ),
      buy_orders AS (
        SELECT
          ${Prisma.raw(binIntervalExpression)} as bin_timestamp,
          AVG(price ${Prisma.sql([priceOperation])} ${Prisma.sql([
        unitPriceDiffMultiplier,
      ])}) as agg_price,  -- Average price for buys
          COUNT(*) as order_count
        FROM
          order_swap_fill
        WHERE
          to_asset_id = ${baseAssetId} AND from_asset_id = ${quoteAssetId} AND
          transaction_date_fill BETWEEN ${startTime} AND ${endTime}
        GROUP BY
          bin_timestamp
      ),
      sell_orders AS (
        SELECT
          ${Prisma.raw(binIntervalExpression)} as bin_timestamp,
          AVG((1 / price) ${Prisma.sql([priceOperation])} ${Prisma.sql([
        unitPriceDiffMultiplier,
      ])}) as agg_price,  -- Inverted average price for sells
          COUNT(*) as order_count
        FROM
          order_swap_fill
        WHERE
          to_asset_id = ${quoteAssetId} AND from_asset_id = ${baseAssetId} AND
          transaction_date_fill BETWEEN ${startTime} AND ${endTime}
        GROUP BY
          bin_timestamp
      ),
      combined_orders AS (
        SELECT
          COALESCE(b.bin_timestamp, s.bin_timestamp) as bin_timestamp,
          (COALESCE(b.agg_price * b.order_count, 0) + COALESCE(s.agg_price * s.order_count, 0)) /
          NULLIF(COALESCE(b.order_count, 0) + COALESCE(s.order_count, 0), 0) as combined_agg_price
        FROM
          buy_orders b
          FULL OUTER JOIN sell_orders s ON b.bin_timestamp = s.bin_timestamp
      ),
      combined_with_time_bins AS (
        SELECT
          t.bin_timestamp,
          c.combined_agg_price
        FROM
          time_bins t
          LEFT JOIN combined_orders c ON t.bin_timestamp = c.bin_timestamp
      )
      SELECT
        EXTRACT(EPOCH FROM bin_timestamp) as timestamp,
        combined_agg_price as price
      FROM
        combined_with_time_bins
      ORDER BY
        bin_timestamp ASC;
    `);

    const nullPriceRemovedData = data.map(item => ({
      timestamp: item.timestamp,
      ...(item.price !== null &&
        item.price !== undefined && {price: item.price}),
    }));

    return nullPriceRemovedData;
  }

  async getUserAggregatedFillsPerBin(
    prisma: Prisma.TransactionClient,
    assetPair: Private.AssetPair,
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval,
    userId: string
  ): Promise<Private.TimeseriesBinFillsQueryResponse[]> {
    const timeseriesSqlParams = this.getTimeseriesSqlParams(
      startTime,
      endTime,
      binInterval
    );
    const {
      seriesInterval,
      seriesStartTimeExpression,
      seriesEndTimeExpression,
      getBinIntervalExpression,
    } = timeseriesSqlParams;

    const orderSwapFillBinIntervalExpression = getBinIntervalExpression(
      'order_swap_fill.transaction_date_fill'
    );

    const {
      baseAsset: {assetId: baseAssetId, decimalPrecision: baseAssetPrecision},
      quoteAsset: {
        assetId: quoteAssetId,
        decimalPrecision: quoteAssetPrecision,
      },
    } = assetPair;

    this.loggerService.info(
      `getUserAggregatedFillsPerBin timeseriesSqlParams: ${JSON.stringify({
        baseAssetId,
        quoteAssetId,
        startTime,
        endTime,
        binInterval,
        userId,
        ...timeseriesSqlParams,
      })}`
    );

    /**
     * - buy quote (lovelace)
     * - buy base (other)
     * - sell quote (other)
     * - sell base (lovelace)
     */
    const baseAssetDisplayUnitMultiplier = Math.pow(
      10,
      baseAssetPrecision
    ).toString();
    const quoteAssetDisplayUnitMultiplier = Math.pow(
      10,
      quoteAssetPrecision
    ).toString();

    // Used to convert lovelace flat fees to display units.
    const adaAsset = await this.assetRepository.getAdaAsset(prisma);
    const adaDisplayUnitMultiplier = Math.pow(
      10,
      adaAsset.decimalPrecision
    ).toString();

    /**
     * Price in indivisible units does not equal price in display units when there is a difference between the asset display precision values.
     * This query specifically ensures that the price aggregate is represented in the display unit.
     */
    const decimalPrecisionDiff = baseAssetPrecision - quoteAssetPrecision;
    const priceOperation = decimalPrecisionDiff > 0 ? '*' : '/';
    const decimalPrecisionDiffAbsolute = Math.abs(decimalPrecisionDiff);
    const unitPriceDiffMultiplier = calcUnitMultiplier(
      decimalPrecisionDiffAbsolute
    ).toString();

    const data: Private.TimeseriesBinFillsQueryResponse<Decimal, bigint>[] =
      await prisma.$queryRaw(Prisma.sql`
      WITH time_bins AS (
        SELECT generate_series(
          ${Prisma.raw(seriesStartTimeExpression)},
          ${Prisma.raw(seriesEndTimeExpression)},
          ${seriesInterval}::interval
        ) as bin_timestamp
      ),

      buy_orders AS (
        SELECT
          ${Prisma.raw(orderSwapFillBinIntervalExpression)} as bin_timestamp,
          AVG(order_swap_fill.price ${Prisma.sql([
            priceOperation,
          ])} ${Prisma.sql([
        unitPriceDiffMultiplier,
      ])}) as agg_price,  -- Average price for buys
          COUNT(*) as order_count
        FROM
          order_swap_fill
        WHERE
          order_swap_fill.to_asset_id = ${baseAssetId} AND order_swap_fill.from_asset_id = ${quoteAssetId} AND
          order_swap_fill.transaction_date_fill BETWEEN ${startTime} AND ${endTime}
        GROUP BY
          bin_timestamp
      ),

      sell_orders AS (
        SELECT
          ${Prisma.raw(orderSwapFillBinIntervalExpression)} as bin_timestamp,
          AVG((1 / order_swap_fill.price) ${Prisma.sql([
            priceOperation,
          ])} ${Prisma.sql([
        unitPriceDiffMultiplier,
      ])}) as agg_price,  -- Inverted average price for sells
          COUNT(*) as order_count
        FROM
          order_swap_fill
        WHERE
          order_swap_fill.to_asset_id = ${quoteAssetId} AND order_swap_fill.from_asset_id = ${baseAssetId} AND
          order_swap_fill.transaction_date_fill BETWEEN ${startTime} AND ${endTime}
        GROUP BY
          bin_timestamp
      ),

      combined_orders AS (
        SELECT
          COALESCE(b.bin_timestamp, s.bin_timestamp) as bin_timestamp,
          (COALESCE(b.agg_price * b.order_count, 0) + COALESCE(s.agg_price * s.order_count, 0)) /
          NULLIF(COALESCE(b.order_count, 0) + COALESCE(s.order_count, 0), 0) as combined_agg_price
        FROM
          buy_orders b
          FULL OUTER JOIN sell_orders s ON b.bin_timestamp = s.bin_timestamp
      ),

      user_buy_orders AS (
        SELECT
          ${Prisma.raw(orderSwapFillBinIntervalExpression)} as bin_timestamp,
          SUM(from_asset_amount_filled) / ${Prisma.sql([
            quoteAssetDisplayUnitMultiplier,
          ])} as total_buy_from_amount_filled,
          SUM(to_asset_amount_filled) / ${Prisma.sql([
            baseAssetDisplayUnitMultiplier,
          ])} as total_buy_to_amount_filled,
          COUNT(*) as total_buy_count
        FROM
          order_swap_fill
        JOIN order_swap ON order_swap.order_swap_id = order_swap_fill.order_swap_id
        WHERE
          order_swap_fill.to_asset_id = ${baseAssetId}
          AND order_swap_fill.from_asset_id = ${quoteAssetId}
          AND (order_swap_fill.transaction_date_fill BETWEEN ${startTime} AND ${endTime})
          AND order_swap.user_id::text = ${userId}
        GROUP BY
          bin_timestamp
      ),

      user_sell_orders AS (
        SELECT
          ${Prisma.raw(orderSwapFillBinIntervalExpression)} as bin_timestamp,
          SUM(from_asset_amount_filled) / ${Prisma.sql([
            baseAssetDisplayUnitMultiplier,
          ])} as total_sell_from_amount_filled,
          SUM(to_asset_amount_filled) / ${Prisma.sql([
            quoteAssetDisplayUnitMultiplier,
          ])} as total_sell_to_amount_filled,
          COUNT(*) as total_sell_count
        FROM
          order_swap_fill
        JOIN order_swap ON order_swap.order_swap_id = order_swap_fill.order_swap_id
        WHERE
          order_swap_fill.to_asset_id = ${quoteAssetId}
          AND order_swap_fill.from_asset_id = ${baseAssetId}
          AND (order_swap_fill.transaction_date_fill BETWEEN ${startTime} AND ${endTime})
          AND order_swap.user_id::text = ${userId}
        GROUP BY
          bin_timestamp
      ),

      user_all_orders_open_fees AS (
        SELECT
          ${Prisma.raw(
            getBinIntervalExpression('transaction_date_open')
          )} as bin_timestamp,
          SUM(transaction_fee_amount) / ${Prisma.sql([
            adaDisplayUnitMultiplier,
          ])} as total_open_transaction_fee_amount,
          SUM(maker_lovelace_flat_fee_amount) / ${Prisma.sql([
            adaDisplayUnitMultiplier,
          ])} as total_maker_ada_flat_fee_amount,
          SUM(maker_from_asset_fee_amount) FILTER (WHERE to_asset_id = ${baseAssetId}) / ${Prisma.sql(
        [quoteAssetDisplayUnitMultiplier]
      )} as total_buy_maker_from_asset_fee_amount,
          SUM(maker_from_asset_fee_amount) FILTER (WHERE to_asset_id = ${quoteAssetId}) / ${Prisma.sql(
        [baseAssetDisplayUnitMultiplier]
      )} as total_sell_maker_from_asset_fee_amount
        FROM
          order_swap
        WHERE
          (
            (to_asset_id = ${baseAssetId} AND from_asset_id = ${quoteAssetId})
            OR
            (to_asset_id = ${quoteAssetId} AND from_asset_id = ${baseAssetId})
          )
          AND (transaction_date_open BETWEEN ${startTime} AND ${endTime})
          AND user_id::text = ${userId}
        GROUP BY
          bin_timestamp
      ),

      user_all_orders_cancel_shared_tx_count AS (
        SELECT
          os.cancellation_transaction_hash,
          COUNT(*) as count
        FROM
          order_swap os
        WHERE
          (os.transaction_date_cancel BETWEEN ${startTime} AND ${endTime})
          AND os.order_status = 'CANCELLED'
        GROUP BY
          cancellation_transaction_hash
      ),

      user_all_orders_cancel_fees AS (
        SELECT
          ${Prisma.raw(
            getBinIntervalExpression('os.transaction_date_cancel')
          )} as bin_timestamp,
          SUM(os.cancellation_transaction_fee_amount / COALESCE(shared_tx.count, 1)) / ${Prisma.sql(
            [adaDisplayUnitMultiplier]
          )} as total_cancel_transaction_fee_amount
        FROM
          order_swap os
          LEFT JOIN
            user_all_orders_cancel_shared_tx_count shared_tx
          ON
            os.cancellation_transaction_hash = shared_tx.cancellation_transaction_hash
        WHERE
          (
            (os.to_asset_id = ${baseAssetId} AND os.from_asset_id = ${quoteAssetId})
            OR
            (os.to_asset_id = ${quoteAssetId} AND os.from_asset_id = ${baseAssetId})
          )
          AND (os.transaction_date_cancel BETWEEN ${startTime} AND ${endTime})
          AND os.order_status = 'CANCELLED'
          AND os.user_id::text = ${userId}
        GROUP BY
          bin_timestamp
      ),

      combined_with_time_bins AS (
        SELECT
          t.bin_timestamp,
          c.combined_agg_price,
          ubo.total_buy_to_amount_filled,
          ubo.total_buy_from_amount_filled,
          ubo.total_buy_count,
          uso.total_sell_to_amount_filled,
          uso.total_sell_from_amount_filled,
          uso.total_sell_count,
          oof.total_open_transaction_fee_amount,
          ocf.total_cancel_transaction_fee_amount,
          oof.total_maker_ada_flat_fee_amount,
          oof.total_buy_maker_from_asset_fee_amount,
          oof.total_sell_maker_from_asset_fee_amount
        FROM
          time_bins t
          LEFT JOIN combined_orders c ON t.bin_timestamp = c.bin_timestamp
          LEFT JOIN user_buy_orders ubo ON t.bin_timestamp = ubo.bin_timestamp
          LEFT JOIN user_sell_orders uso ON t.bin_timestamp = uso.bin_timestamp
          LEFT JOIN user_all_orders_open_fees oof ON t.bin_timestamp = oof.bin_timestamp
          LEFT JOIN user_all_orders_cancel_fees ocf ON t.bin_timestamp = ocf.bin_timestamp
      )

    SELECT
      EXTRACT(EPOCH FROM bin_timestamp) as timestamp,
      combined_agg_price as "internalMarketPrice",

      total_buy_to_amount_filled as "totalBuyToAmountFilled",
      total_buy_from_amount_filled as "totalBuyFromAmountFilled",
      total_buy_count as "totalBuyCount",
      total_sell_to_amount_filled as "totalSellToAmountFilled",
      total_sell_from_amount_filled as "totalSellFromAmountFilled",
      total_sell_count as "totalSellCount",

      total_open_transaction_fee_amount as "totalOpenTransactionFeeAmount",
      total_cancel_transaction_fee_amount as "totalCancelTransactionFeeAmount",
      total_maker_ada_flat_fee_amount as "totalMakerAdaFlatFeeAmount",
      total_buy_maker_from_asset_fee_amount as "totalBuyMakerFromAssetFeeAmount",
      total_sell_maker_from_asset_fee_amount as "totalSellMakerFromAssetFeeAmount"
    FROM
      combined_with_time_bins
    ORDER BY
      bin_timestamp ASC;
    `);

    return map(data, item => ({
      internalMarketPrice: item.internalMarketPrice,

      totalBuyToAmountFilled: item.totalBuyToAmountFilled?.toNumber() || null,
      totalBuyFromAmountFilled:
        item.totalBuyFromAmountFilled?.toNumber() || null,
      totalBuyCount: Number(item.totalBuyCount) || null,
      totalSellToAmountFilled: item.totalSellToAmountFilled?.toNumber() || null,
      totalSellFromAmountFilled:
        item.totalSellFromAmountFilled?.toNumber() || null,
      totalSellCount: Number(item.totalSellCount) || null,

      totalOpenTransactionFeeAmount:
        item.totalOpenTransactionFeeAmount?.toNumber() || null,
      totalCancelTransactionFeeAmount:
        item.totalCancelTransactionFeeAmount?.toNumber() || null,
      totalMakerAdaFlatFeeAmount:
        item.totalMakerAdaFlatFeeAmount?.toNumber() || null,
      totalBuyMakerFromAssetFeeAmount:
        item.totalBuyMakerFromAssetFeeAmount?.toNumber() || null,
      totalSellMakerFromAssetFeeAmount:
        item.totalSellMakerFromAssetFeeAmount?.toNumber() || null,

      timestamp: item.timestamp?.toNumber(),
    }));
  }

  /**
   * Returns ohloc heikin ashi candle stick data
   * https://www.investopedia.com/trading/heikin-ashi-better-candlestick/
   */
  async getMarketOhlcData(
    prisma: Prisma.TransactionClient,
    assetPair: Private.AssetPair,
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval
  ): Promise<Ohlc[]> {
    const {getBinIntervalExpression} = this.getTimeseriesSqlParams(
      startTime,
      endTime,
      binInterval
    );

    const binIntervalExpression = getBinIntervalExpression(
      'transaction_date_fill'
    );

    const {
      baseAsset: {assetId: baseAssetId, decimalPrecision: baseAssetPrecision},
      quoteAsset: {
        assetId: quoteAssetId,
        decimalPrecision: quoteAssetPrecision,
      },
    } = assetPair;

    const decimalPrecisionDiff = baseAssetPrecision - quoteAssetPrecision;
    const priceOperation = decimalPrecisionDiff > 0 ? '*' : '/';
    const decimalPrecisionDiffAbsolute = Math.abs(decimalPrecisionDiff);
    const unitPriceDiffMultiplier = calcUnitMultiplier(
      decimalPrecisionDiffAbsolute
    ).toString();

    const data: Ohlc[] = await prisma.$queryRaw(Prisma.sql`
      WITH price_data AS (
        SELECT
          ${Prisma.raw(binIntervalExpression)} as bin_timestamp,
          price ${Prisma.sql([priceOperation])} ${Prisma.sql([
      unitPriceDiffMultiplier,
    ])} AS display_price,
          ROW_NUMBER() OVER (PARTITION BY ${Prisma.raw(
            binIntervalExpression
          )} ORDER BY transaction_date_fill ASC) as rn_asc,
          ROW_NUMBER() OVER (PARTITION BY ${Prisma.raw(
            binIntervalExpression
          )} ORDER BY transaction_date_fill DESC) as rn_desc
        FROM
          order_swap_fill
        WHERE
          to_asset_id = ${baseAssetId} AND
          from_asset_id = ${quoteAssetId} AND
          transaction_date_fill BETWEEN ${startTime} AND ${endTime}
      ),
      aggregated_price_data AS (
        SELECT
          bin_timestamp,
          MAX(display_price) as high,
          MIN(display_price) as low,
          MAX(case when rn_asc = 1 then display_price end) as open,
          MAX(case when rn_desc = 1 then display_price end) as close
        FROM
          price_data
        GROUP BY
          bin_timestamp
      ),
      heiken_ashi_candles AS (
        SELECT
          bin_timestamp,
          COALESCE(LAG((open + close) / 2) OVER (ORDER BY bin_timestamp), (open + close) / 2) AS open,
          high,
          low,
          (open + high + low + close) / 4 AS close
        FROM
          aggregated_price_data
      )
      SELECT
        bin_timestamp AS time,
        open,
        high,
        low,
        close
      FROM heiken_ashi_candles
      ORDER BY bin_timestamp;
  `);

    return data;
  }

  private getTimeseriesSqlParams(
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval
  ): Private.TimeseriesSqlParams {
    const startTimeISO = startTime.toISOString();
    const endTimeISO = endTime.toISOString();

    const params = {
      '15m': {
        seriesInterval: '15 minutes',
        seriesStartTimeExpression: `date_trunc('minute', TIMESTAMP '${startTimeISO}') + (FLOOR(EXTRACT(MINUTE FROM TIMESTAMP '${startTimeISO}') / 15) * INTERVAL '15 minute')`,
        seriesEndTimeExpression: `date_trunc('minute', TIMESTAMP '${endTimeISO}') + (FLOOR(EXTRACT(MINUTE FROM TIMESTAMP '${endTimeISO}') / 15) * INTERVAL '15 minute')`,
        getBinIntervalExpression: (columnName: string) =>
          `date_trunc('minute', ${columnName}) + (FLOOR(EXTRACT(MINUTE FROM ${columnName}) / 15) * INTERVAL '15 minute')`,
      },
      '30m': {
        seriesInterval: '30 minutes',
        seriesStartTimeExpression: `date_trunc('minute', TIMESTAMP '${startTimeISO}') + (FLOOR(EXTRACT(MINUTE FROM TIMESTAMP '${startTimeISO}') / 30) * INTERVAL '30 minute')`,
        seriesEndTimeExpression: `date_trunc('minute', TIMESTAMP '${endTimeISO}') + (FLOOR(EXTRACT(MINUTE FROM TIMESTAMP '${endTimeISO}') / 30) * INTERVAL '30 minute')`,
        getBinIntervalExpression: (columnName: string) =>
          `date_trunc('minute', ${columnName}) + (FLOOR(EXTRACT(MINUTE FROM ${columnName}) / 30) * INTERVAL '30 minute')`,
      },
      '1h': {
        seriesInterval: '1 hour',
        seriesStartTimeExpression: `date_trunc('hour', TIMESTAMP '${startTimeISO}')`,
        seriesEndTimeExpression: `date_trunc('hour', TIMESTAMP '${endTimeISO}')`,
        getBinIntervalExpression: (columnName: string) =>
          `date_trunc('hour', ${columnName})`,
      },
      '4h': {
        seriesInterval: '4 hours',
        seriesStartTimeExpression: `date_trunc('day', TIMESTAMP '${startTimeISO}') + (FLOOR(EXTRACT(HOUR FROM TIMESTAMP '${startTimeISO}') / 4) * INTERVAL '4 hours')`,
        seriesEndTimeExpression: `date_trunc('day', TIMESTAMP '${endTimeISO}') + (FLOOR(EXTRACT(HOUR FROM TIMESTAMP '${endTimeISO}') / 4) * INTERVAL '4 hours')`,
        getBinIntervalExpression: (columnName: string) =>
          `date_trunc('day', ${columnName}) + (FLOOR(EXTRACT(HOUR FROM ${columnName}) / 4) * INTERVAL '4 hours')`,
      },
      '1d': {
        seriesInterval: '1 day',
        seriesStartTimeExpression: `date_trunc('day', TIMESTAMP '${startTimeISO}')`,
        seriesEndTimeExpression: `date_trunc('day', TIMESTAMP '${endTimeISO}')`,
        getBinIntervalExpression: (columnName: string) =>
          `date_trunc('day', ${columnName})`,
      },
      '1w': {
        seriesInterval: '1 week',
        seriesStartTimeExpression: `date_trunc('week', (TIMESTAMP '${startTimeISO}'))`,
        seriesEndTimeExpression: `date_trunc('week', (TIMESTAMP '${endTimeISO}'))`,
        getBinIntervalExpression: (columnName: string) =>
          `date_trunc('week', ${columnName})`,
      },
    };

    return params[binInterval];
  }
}
