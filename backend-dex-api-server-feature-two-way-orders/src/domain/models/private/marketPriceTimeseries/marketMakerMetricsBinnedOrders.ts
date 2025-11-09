import * as Private from '~/domain/models/private';

export type InternalProfitabilityAccumulationData = {
  timestamp: number;
} & Partial<{
  assetOneAmountBought: number;
  assetTwoAmountBought: number;
  assetOneAmountSold: number;
  assetTwoAmountSold: number;
  earnedPriceAssetAmount: number;
  roiPercent: number;
  externalMarketPrice: number;
  accumulativeAssetOneAmountBought: number;
  accumulativeAssetTwoAmountBought: number;
  accumulativeAssetOneAmountSold: number;
  accumulativeAssetTwoAmountSold: number;
  accumulativeAssetOneAmountNetPosition: number;
  accumulativeAssetTwoAmountNetPosition: number;
  accumulativeAssetOneBoughtCount: number;
  accumulativeAssetTwoBoughtCount: number;
  accumulativeBoughtInPriceAssetAmount: number;
  accumulativeEarnedInPriceAssetAmount: number;
  accumulativeTotalOpenTransactionFeeAmount: number;
  accumulativeTotalCancelTransactionFeeAmount: number;
  accumulativeTotalBuyMakerFromAssetFeeAmount: number;
  accumulativeTotalSellMakerFromAssetFeeAmount: number;
  accumulativeTotalMakerAdaFlatFeeAmount: number;
  accumulativeAssetOneFeesAmount: number;
  accumulativeAssetTwoFeesAmount: number;
}>;

export type MarketMakerBinnedOrdersMetrics = {
  timestamp: number;
} & Partial<
  Pick<
    InternalProfitabilityAccumulationData,
    | 'externalMarketPrice'
    | 'roiPercent'
    | 'earnedPriceAssetAmount'
    | 'accumulativeAssetOneAmountBought'
    | 'accumulativeAssetTwoAmountBought'
    | 'accumulativeAssetOneAmountNetPosition'
    | 'accumulativeAssetTwoAmountNetPosition'
    | 'accumulativeAssetOneBoughtCount'
    | 'accumulativeAssetTwoBoughtCount'
    | 'accumulativeTotalOpenTransactionFeeAmount'
    | 'accumulativeTotalCancelTransactionFeeAmount'
    | 'accumulativeTotalBuyMakerFromAssetFeeAmount'
    | 'accumulativeTotalSellMakerFromAssetFeeAmount'
    | 'accumulativeTotalMakerAdaFlatFeeAmount'
  >
>;

export type MarketMakerMetricsBinnedOrders = {
  assetPair: {
    assetOne: Private.Asset;
    assetTwo: Private.Asset;
  };
  walletStakeKeyHash: string;
  priceAssetId: string;
  data: MarketMakerBinnedOrdersMetrics[];
};
