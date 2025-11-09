import { IChartItem } from '~/pages/Leaderboard/types/IChartItem';
import { Asset, MarketMakerMetricsBinnedOrders } from '~/redux/api';
import { optional } from '~/utils/object';

import { ChartMode } from '../types/ChartMode';
import { proportionalToPercent } from './formatting';

export interface IChartData {
  dataPoints: IChartItem[];
  priceAsset: Asset | null;
}

export const getTooltipLabelByMode = (mode: ChartMode): string => {
  switch (mode) {
    case ChartMode.ROI:
      return 'ROI';
    case ChartMode.Earned:
      return 'Earned';
  }
};

type MarketMakerMetric = MarketMakerMetricsBinnedOrders['data'][0];

const getTradingWalletProfitabilityMetrics = ({
  assetOneAmountBought,
  assetTwoAmountBought,
  assetOneAmountNetPosition,
  assetTwoAmountNetPosition,
  assetOneBoughtCount,
  assetTwoBoughtCount,
  openTransactionFeeAmount,
  cancelTransactionFeeAmount,
  buyMakerFromAssetFeeAmount,
  sellMakerFromAssetFeeAmount,
  makerAdaFlatFeeAmount,
}: MarketMakerMetric): Omit<
  IChartData['dataPoints'][0],
  'time' | 'price' | 'roiPercent' | 'earnedPriceAssetAmount'
> => ({
  ...optional({
    assetOneAmountBought,
    assetTwoAmountBought,
    assetOneAmountNetPosition,
    assetTwoAmountNetPosition,
    assetOneBoughtCount,
    assetTwoBoughtCount,
    openTransactionFeeAmount,
    cancelTransactionFeeAmount,
    buyMakerFromAssetFeeAmount,
    sellMakerFromAssetFeeAmount,
    makerAdaFlatFeeAmount,
  }),
});

export const getChartDataByMode = (
  mode: ChartMode,
  priceAsset: Asset | null,
  marketPerformance?: MarketMakerMetricsBinnedOrders,
): IChartData => {
  switch (mode) {
    case ChartMode.ROI: {
      const dataPoints: IChartItem[] = (marketPerformance?.data || []).map((item) => ({
        time: item.timestamp,
        ...(item.roiPercent ? { value: proportionalToPercent(item.roiPercent) } : {}),
        ...(item.price ? { price: item.price.toFixed(5) } : {}),
        ...getTradingWalletProfitabilityMetrics(item),
      }));

      return { dataPoints, priceAsset };
    }

    case ChartMode.Earned: {
      const dataPoints: IChartItem[] = (marketPerformance?.data || []).map((item) => ({
        time: item.timestamp,
        ...(item.earnedPriceAssetAmount
          ? { value: parseFloat(item.earnedPriceAssetAmount) }
          : {}),
        ...(item.price ? { price: item.price.toFixed(5) } : {}),
        ...getTradingWalletProfitabilityMetrics(item),
      }));

      return {
        dataPoints,
        priceAsset,
      };
    }
  }
};
