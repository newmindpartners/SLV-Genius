import * as Private from '~/domain/models/private';

export type MarketAggPriceHistory = {
  assetPair: Private.AssetPair;
  data: Private.TimeseriesAggPriceData[];
};
