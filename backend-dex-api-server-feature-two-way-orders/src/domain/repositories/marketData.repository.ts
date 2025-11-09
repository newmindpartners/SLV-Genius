import 'reflect-metadata';
import {TransactionalContext} from '~/domain/context';
import * as Private from '~/domain/models/private';
import {Ohlc} from '~/implementation/client/maestro/maestro.client';

export interface MarketDataRepository {
  getMarketAggPrice(
    context: TransactionalContext,
    assetPair: Private.AssetPair,
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval
  ): Promise<Private.TimeseriesAggPriceData[]>;

  getMarketOhlcData(
    context: TransactionalContext,
    assetPair: Private.AssetPair,
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval
  ): Promise<Ohlc[]>;

  getUserAggregatedFillsPerBin(
    prisma: TransactionalContext,
    assetPair: Private.AssetPair,
    startTime: Date,
    endTime: Date,
    binInterval: Private.BinInterval,
    userId: String
  ): Promise<Private.TimeseriesBinFillsQueryResponse[]>;
}
