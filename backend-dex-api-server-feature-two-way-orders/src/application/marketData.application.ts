import {inject, singleton} from 'tsyringe';
import {TransactionalContext} from '~/domain/context';
import {DomainMapper} from '~/implementation/prisma/domain.mapper';
import {MarketDataRepository} from '~/domain/repositories/marketData.repository';
import {AssetRepository, UserRepository} from '~/domain/repositories';
import {ApplicationError} from './application.error';
import {ErrorCode} from '~/domain/errors';
import {LoggerService, MarketDataService} from '~/domain/services';
import {
  MaestroClientAxios,
  Ohlc,
} from '~/implementation/client/maestro/maestro.client';
import {filterPriceData} from '~/domain/utils/marketData.filter';

import {includes, last, size} from 'lodash';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {isNull} from 'lodash';
import {isEmpty} from 'bullmq';
import {isAda} from '~/domain/utils/asset.util';
import {subtractBinIntervalDuration} from '~/domain/utils/marketData.util';

@singleton()
export class MarketDataApplication {
  constructor(
    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('MarketDataRepository')
    private readonly marketDataRepository: MarketDataRepository,

    @inject('MarketDataService')
    private readonly marketDataService: MarketDataService,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('MaestroClient')
    private readonly maestroClient: MaestroClientAxios,

    @inject('LoggerService')
    private readonly loggerService: LoggerService
  ) {}

  async getMarketAggPrice(
    context: TransactionalContext,
    baseAssetId: string,
    quoteAssetId: string,
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval
  ): Promise<Public.MarketAggPrice> {
    const assetPair = await this.assetRepository.getAssetsByAssetPairIds(
      context,
      baseAssetId,
      quoteAssetId
    );

    const data = await this.marketDataRepository.getMarketAggPrice(
      context,
      assetPair,
      startTime,
      endTime,
      binInterval
    );

    const binChunks = 10; // 10 bins
    const gapProportion = 0.4; // Gap identified if there is a period constituting 40% of the distribution
    const gapIgnoreProportion = 0.05; // Do not invalidate gap detection if samples in gap are smaller than 5%
    const dataKeyToFilter = 'price';

    this.loggerService.info(
      `MarketData timeseries filter params binChunks: <${binChunks}>, gapProportion: <${gapProportion}>, gapIgnoreProportion: <${gapIgnoreProportion}>`
    );

    const filteredData = await filterPriceData<Private.TimeseriesAggPriceData>(
      binChunks,
      gapProportion,
      gapIgnoreProportion,
      data,
      dataKeyToFilter
    );

    this.loggerService.info(
      `MarketData timeseries filtered (${filteredData.length} / ${data.length})`
    );

    return this.domainMapper.toPublicMarketAggPrice({
      assetPair,
      data: filteredData,
    });
  }

  async getMarketKline(
    context: TransactionalContext,
    baseAssetId: string,
    quoteAssetId: string,
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval
  ) {
    const assetPair = await this.assetRepository.getAssetsByAssetPairIds(
      context,
      baseAssetId,
      quoteAssetId
    );

    const data = await this.marketDataRepository.getMarketOhlcData(
      context,
      assetPair,
      startTime,
      endTime,
      binInterval
    );

    const binChunks = 10; // 10 bins
    const gapProportion = 0.4; // Gap identified if there is a period constituting 40% of the distribution
    const gapIgnoreProportion = 0.05; // Do not invalidate gap detection if samples in gap are smaller than 5%
    const dataKeyToFilter = 'high';

    this.loggerService.info(
      `MarketData kline filter params binChunks: <${binChunks}>, gapProportion: <${gapProportion}>, gapIgnoreProportion: <${gapIgnoreProportion}>`
    );

    const filteredData = await filterPriceData<Ohlc>(
      binChunks,
      gapProportion,
      gapIgnoreProportion,
      data,
      dataKeyToFilter
    );

    const response = {
      data: filteredData,
      quoteAssetId,
      baseAssetId,
      priceAssetId: quoteAssetId,
    };

    this.loggerService.info(
      `MarketData kline filtered (${filteredData.length} / ${data.length})`
    );

    return response;
  }

  async getWalletMarketMakerMetricsBinnedOrders(
    context: TransactionalContext,
    assetIdPair: [string, string],
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval,
    walletStakeKeyHash: string
  ): Promise<Private.MarketMakerMetricsBinnedOrders> {
    const [assetOneId, assetTwoId] = assetIdPair;
    const user = await this.userRepository.getUserByStakeKeyHash(
      context,
      walletStakeKeyHash
    );

    if (isNull(user))
      throw new ApplicationError(
        ErrorCode.USER__WALLET_STAKE_KEY_HASH_NOT_FOUND
      );

    const assetPair = await this.assetRepository.getAssetsByAssetPairIds(
      context,
      assetOneId,
      assetTwoId
    );

    // Ordered asset pair used to ensure price data in ada across sources.
    const orderedAssetPair = this.marketDataService.orderPairByPriceAsset(
      assetPair,
      isAda
    );

    const timeseriesBinFillsDatas: Private.TimeseriesBinFillsQueryResponse[] =
      await this.marketDataRepository.getUserAggregatedFillsPerBin(
        context,
        orderedAssetPair,
        startTime,
        endTime,
        binInterval,
        user.userId
      );

    const internalPopulatedBinFillsTimestamps = timeseriesBinFillsDatas
      .filter(this.marketDataService.isBinFillsDataPresent)
      .map(({timestamp}) => timestamp);

    /**
     * Unless we do this we won't get external market price data for our first bin.
     * This is because Maestro does not include market data for bins that are overlapping
     * if their timestamp is not within our start and end times.
     */
    const negativeOffsetStartTime = subtractBinIntervalDuration(
      startTime,
      binInterval
    );

    const dexTarget = 'minswap';
    const externalMarketPriceData = await this.maestroClient.getMarketKline(
      orderedAssetPair,
      negativeOffsetStartTime,
      endTime,
      binInterval,
      dexTarget
    );

    if (isEmpty(externalMarketPriceData)) {
      this.loggerService.warning(
        `MarketData profitability accumulation - missing external market price data ` +
          `for time range ${startTime} - ${endTime}, bin interval ${binInterval} and ` +
          `asset pair ${orderedAssetPair.baseAsset.assetName}/${orderedAssetPair.quoteAsset.assetName}`
      );
    }

    const processedExternalMarketPrice = externalMarketPriceData
      // Determine average price from candle ohlc
      .map(({time, high, low}: Ohlc) => ({
        timestamp: Date.parse(time) / 1000,
        externalMarketPrice: (high + low) / 2,
      }))
      // filter minswap data for our wallet bins
      .filter(({timestamp}) =>
        includes(internalPopulatedBinFillsTimestamps, timestamp)
      )
      // create timestamp hash map to join on
      .reduce(
        (result, value) => ({
          ...result,
          [value.timestamp]: value.externalMarketPrice,
        }),
        {} as Record<number, number>
      );

    const internalExternalDataDiffCount =
      size(internalPopulatedBinFillsTimestamps) -
      size(processedExternalMarketPrice);

    /**
     * If this happens, that means that we did not find external market price for all
     * of our internal bin data. This should not be happening on a regular basis as we
     * use very large bins for these queries, but we would like to track this in case
     * our assumptions are wrong.
     */
    if (internalExternalDataDiffCount > 0) {
      this.loggerService.warning(
        `MarketData profitability accumulation - missing external market price data for some of our internal bin fills. ` +
          `Amount of internal bins missing external market price: ${internalExternalDataDiffCount} out of a total of ${size(
            internalPopulatedBinFillsTimestamps
          )} ` +
          `for time range ${startTime} - ${endTime} and bin interval ${binInterval}`
      );
    }

    /**
     * Join gy and maestro minswap data on timestamp
     * Note that we will ignore fill data in bins where we for some reason
     * cannot obtain an external market price.
     */
    const stitchedTimeseriesBinFillsDatas: Private.StitchedTimeseriesBinFillsData[] =
      timeseriesBinFillsDatas.reduce((result, value) => {
        const previousExternalMarketPrice: number | undefined =
          last(result)?.externalMarketPrice;

        const currentExternalMarketPrice: number | undefined =
          processedExternalMarketPrice[value.timestamp];

        const externalMarketPrice: number | undefined =
          currentExternalMarketPrice || previousExternalMarketPrice;

        const newStitchedData: Private.StitchedTimeseriesBinFillsData = {
          ...value,
          externalMarketPrice,
        };

        return result.concat(newStitchedData);
      }, [] as Private.StitchedTimeseriesBinFillsData[]);

    const data: Private.MarketMakerMetricsBinnedOrders['data'] =
      this.marketDataService.produceProfitabilityAccumulationDatas(
        stitchedTimeseriesBinFillsDatas
      );

    const marketMakerMetricsBinnedOrders: Private.MarketMakerMetricsBinnedOrders =
      {
        data,
        walletStakeKeyHash,
        assetPair: {
          assetOne: orderedAssetPair.baseAsset,
          assetTwo: orderedAssetPair.quoteAsset,
        },
        priceAssetId: orderedAssetPair.quoteAsset.assetId, // TODO price asset should be quote asset
      };

    this.loggerService.info(
      `MarketData metrics from binned orders`,
      marketMakerMetricsBinnedOrders
    );

    return marketMakerMetricsBinnedOrders;
  }

  async getPublicWalletMarketMakerMetricsBinnedOrders(
    context: TransactionalContext,
    assetIdPair: [string, string],
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval,
    walletStakeKeyHash: string
  ): Promise<Public.MarketMakerMetricsBinnedOrders> {
    const marketMakerMetricsBinnedOrders =
      await this.getWalletMarketMakerMetricsBinnedOrders(
        context,
        assetIdPair,
        startTime,
        endTime,
        binInterval,
        walletStakeKeyHash
      );

    return this.domainMapper.toPublicMarketMakerMetricsBinnedOrders(
      marketMakerMetricsBinnedOrders
    );
  }
}
