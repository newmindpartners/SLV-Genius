import {FastifyRequest} from 'fastify';
import {inject, singleton} from 'tsyringe';
import {AbstractQuery} from '~/implementation/fastify/abstract.query';
import {PrismaClient} from '@prisma/client';
import {ConfigService} from '~/domain/services';
import {MarketDataApplication} from '~/application/marketData.application';
import * as Private from '~/domain/models/private';
import * as Public from '~/domain/models/public';
import {splitAssetIdPair} from '~/domain/utils/string.util';
import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';
import {isValidIsoDateString} from '~/domain/utils/date.util';
import {isValidBinInterval} from '~/domain/utils/marketData.util';

@singleton()
export class MarketDataQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject(MarketDataApplication)
    private readonly marketDataApplication: MarketDataApplication
  ) {
    super(configService);
  }

  async getMarketAggPrice(
    req: FastifyRequest<{
      Params: {
        assetPair: string;
      };
      Querystring: Private.MarketAggPriceHistoryQuery;
    }>
  ) {
    const {assetPair} = req.params;
    const {startTime, endTime, binInterval} = req.query;

    if (!isValidIsoDateString(startTime) || !isValidIsoDateString(endTime))
      throw new ApplicationError(
        ErrorCode.REQUEST_VALIDATION__INVALID_ISO_TIMESTAMP
      );

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    if (!isValidBinInterval(startTimeDate, endTimeDate, binInterval))
      throw new ApplicationError(ErrorCode.INVALID_BIN_INTERVAL_FOR_DURATION);

    // TODO get default base and quote from trading pair record
    const {baseAssetId, quoteAssetId} = splitAssetIdPair(assetPair);

    if (baseAssetId && quoteAssetId) {
      return this.marketDataApplication.getMarketAggPrice(
        this.prisma,
        baseAssetId,
        quoteAssetId,
        startTimeDate,
        endTimeDate,
        binInterval
      );
    } else {
      throw new ApplicationError(
        ErrorCode.REQUEST_VALIDATION__MALFORMED_ASSET_PAIR_REFERENCE
      );
    }
  }

  async getMarketKline(
    req: FastifyRequest<{
      Params: {
        assetPair: string;
      };
      Querystring: Private.MarketKlineHistoryQuery;
    }>
  ) {
    const {assetPair} = req.params;
    const {startTime, endTime, binInterval} = req.query;

    if (!isValidIsoDateString(startTime) || !isValidIsoDateString(endTime))
      throw new ApplicationError(
        ErrorCode.REQUEST_VALIDATION__INVALID_ISO_TIMESTAMP
      );

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    if (!isValidBinInterval(startTimeDate, endTimeDate, binInterval))
      throw new ApplicationError(ErrorCode.INVALID_BIN_INTERVAL_FOR_DURATION);

    // TODO get default base and quote from trading pair record
    const {baseAssetId, quoteAssetId} = splitAssetIdPair(assetPair);

    if (baseAssetId && quoteAssetId) {
      return this.marketDataApplication.getMarketKline(
        this.prisma,
        baseAssetId,
        quoteAssetId,
        startTimeDate,
        endTimeDate,
        binInterval
      );
    } else {
      throw new ApplicationError(
        ErrorCode.REQUEST_VALIDATION__MALFORMED_ASSET_PAIR_REFERENCE
      );
    }
  }

  async getWalletMarketMakerMetricsBinnedOrders(
    req: FastifyRequest<{
      Params: {
        assetPair: string;
      };
      Querystring: Private.MarketMakerMetricsBinnedOrdersQuery;
    }>
  ): Promise<Public.MarketMakerMetricsBinnedOrders> {
    const {assetPair} = req.params;
    const {startTime, endTime, binInterval, filterByWalletStakeKeyHash} =
      req.query;

    if (!isValidIsoDateString(startTime) || !isValidIsoDateString(endTime))
      throw new ApplicationError(
        ErrorCode.REQUEST_VALIDATION__INVALID_ISO_TIMESTAMP
      );

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    if (!isValidBinInterval(startTimeDate, endTimeDate, binInterval))
      throw new ApplicationError(ErrorCode.INVALID_BIN_INTERVAL_FOR_DURATION);

    const {baseAssetId, quoteAssetId} = splitAssetIdPair(assetPair);

    if (baseAssetId && quoteAssetId) {
      return this.marketDataApplication.getPublicWalletMarketMakerMetricsBinnedOrders(
        this.prisma,
        [baseAssetId, quoteAssetId],
        startTimeDate,
        endTimeDate,
        binInterval,
        filterByWalletStakeKeyHash
      );
    } else {
      throw new ApplicationError(
        ErrorCode.REQUEST_VALIDATION__MALFORMED_ASSET_PAIR_REFERENCE
      );
    }
  }
}
