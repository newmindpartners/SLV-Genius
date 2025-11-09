import {BinInterval} from './binInterval';

/**
 * Ideally we would source this from the open-api schema generated types
 * but they are listed as an array rather than an object so that is not feasible.
 * We would need to update `oazapfts` and use `--argumentStyle` to be able to do this.
 */
type MarketDataQueryInput = {
  startTime: string;
  endTime: string;
  binInterval: BinInterval;
};

export type MarketAggPriceHistoryQuery = MarketDataQueryInput;

export type MarketKlineHistoryQuery = MarketDataQueryInput;

export type MarketMakerMetricsBinnedOrdersQuery = MarketDataQueryInput & {
  filterByWalletStakeKeyHash: string;
};
