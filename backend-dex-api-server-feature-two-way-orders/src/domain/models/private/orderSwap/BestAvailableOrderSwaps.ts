import * as Public from '~/domain/models/public';
import {ValidOrderSwap} from '~/domain/models/private';

export type MarketOrderResults = {
  marketOrderPriceData: MarketOrderPriceData;
  marketOrderFillAmountAssetId: string;
  marketOrderSwaps: BestAvailableOrderSwapResults;
};

export type MarketOrderPriceData = Pick<
  Public.MarketOrderSwapResults,
  | 'displayUnitPrice'
  | 'displayUnitPriceAssetId'
  | 'marketOrderSwapFilledAmount'
  | 'marketOrderSwapTotalFillAmount'
>;

export type BestAvailableOrderSwapResultsWithAlternativeOrder = {
  result: BestAvailableOrderSwapResults;
  alternativeResult: BestAvailableOrderSwapResults;
};

export type BestAvailableOrderSwapResults = {
  marketOrderSwap: ValidOrderSwap;
  marketOrderSwapFillAmount: string;
  marketOrderSwapToAmount: string;
}[];

export type BestAvailableOrderSwapWithAlternativeOrders = {
  result: ValidOrderSwap[];
  alternativeResult: ValidOrderSwap[];
};
