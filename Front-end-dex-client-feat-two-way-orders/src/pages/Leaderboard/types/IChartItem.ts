import { MarketMakerMetricsBinnedOrders } from '~/redux/api';

export type IChartItemExtraData = Pick<
  MarketMakerMetricsBinnedOrders['data'][0],
  | 'assetOneAmountBought'
  | 'assetTwoAmountBought'
  | 'assetOneAmountNetPosition'
  | 'assetTwoAmountNetPosition'
  | 'assetOneBoughtCount'
  | 'assetTwoBoughtCount'
  | 'openTransactionFeeAmount'
  | 'openTransactionFeeAmount'
  | 'cancelTransactionFeeAmount'
  | 'buyMakerFromAssetFeeAmount'
  | 'sellMakerFromAssetFeeAmount'
  | 'makerAdaFlatFeeAmount'
> & {
  price?: string;
};

export type IChartItem = {
  time: number;
  value?: number;
} & IChartItemExtraData;
