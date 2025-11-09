import { sum } from 'lodash';
import { IChartItemExtraData } from '~/pages/Leaderboard/types/IChartItem';

export enum Section {
  TradedAssetOne,
  TradedAssetTwo,
  FeesAssetOne,
  FeesAssetTwo,
}

export const getFeeSectionsSummary = (data: IChartItemExtraData) => ({
  [Section.TradedAssetOne]: {
    totalFee: Number(data.assetOneAmountNetPosition) || 0,
    breakdown: [
      {
        label: 'Bought',
        amount: Number(data.assetOneAmountBought) || 0,
      },
      {
        label: 'Trades',
        amount: Number(data.assetOneBoughtCount) || 0,
      },
    ],
  },
  [Section.TradedAssetTwo]: {
    totalFee: Number(data.assetTwoAmountNetPosition) || 0,
    breakdown: [
      {
        label: 'Bought',
        amount: Number(data.assetTwoAmountBought) || 0,
      },
      {
        label: 'Trades',
        amount: Number(data.assetTwoBoughtCount) || 0,
      },
    ],
  },
  [Section.FeesAssetOne]: {
    totalFee: Number(data.sellMakerFromAssetFeeAmount) || 0,
    breakdown: [
      {
        label: 'Maker (%)',
        amount: Number(data.sellMakerFromAssetFeeAmount) || 0,
      },
    ],
  },
  [Section.FeesAssetTwo]: {
    totalFee: sum([
      Number(data.openTransactionFeeAmount) || 0,
      Number(data.cancelTransactionFeeAmount) || 0,
      Number(data.buyMakerFromAssetFeeAmount) || 0,
      Number(data.makerAdaFlatFeeAmount) || 0,
    ]),
    breakdown: [
      {
        label: 'Open (tx)',
        amount: Number(data.openTransactionFeeAmount) || 0,
      },
      {
        label: 'Maker (%)',
        amount: Number(data.buyMakerFromAssetFeeAmount) || 0,
      },
      {
        label: 'Maker flat',
        amount: Number(data.makerAdaFlatFeeAmount) || 0,
      },
      {
        label: 'Cancel (tx)',
        amount: Number(data.cancelTransactionFeeAmount) || 0,
      },
    ],
  },
});
