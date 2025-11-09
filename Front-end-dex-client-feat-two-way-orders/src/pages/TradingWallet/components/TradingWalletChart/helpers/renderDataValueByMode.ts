import { ChartMode } from '~/pages/TradingWallet/types/ChartMode';
import { Asset } from '~/redux/api';
import { formatNumberWithPrecision } from '~/utils/math';

export const renderDataValueByMode = (
  num: number,
  chartMode: ChartMode,
  priceAsset: Asset,
): string => {
  switch (chartMode) {
    case ChartMode.Earned: {
      return `${formatNumberWithPrecision(
        num,
        Math.min(priceAsset.decimalPrecision, 2),
      )} ${priceAsset.shortName}`;
    }
    case ChartMode.ROI: {
      return `${formatNumberWithPrecision(num, 2)}%`;
    }
  }
};
