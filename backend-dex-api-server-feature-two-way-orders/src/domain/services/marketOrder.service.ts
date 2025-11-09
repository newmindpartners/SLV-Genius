import {Big} from 'big.js';
import {subtract} from 'lodash';
import * as Private from '~/domain/models/private';

type UnitPriceDiffMultiplier = {
  decimalPrecisionDiff: number;
  unitPriceDiffMultiplier: Big;
};

export interface MarketOrderPriceService {
  calculateVWAPMarketPrice(
    orderSwapFills: Private.OrderSwapFill[],
    toAsset: Private.Asset,
    fromAsset: Private.Asset
  ): string;

  calculateDisplayUnitPrice(
    decimalPrecisionDiff: number,
    unitPriceDiffMultiplier: Big,
    indivisiblePrice: Big
  ): Big;

  calculateUnitPriceDiffMultiplier(
    toAssetDecimalPrecision: number,
    fromAssetDecimalPrecision: number
  ): UnitPriceDiffMultiplier;
}

export class MarketOrderPriceServiceImplementation
  implements MarketOrderPriceService
{
  // The VWAP (Volume Weighted Average Price) is computed by taking the sum of
  // the product of each order's price (from asset amount divided by to asset amount)
  // and the from asset amount (which is effectively the volume of the order), and
  // then dividing that total sum by the sum of all the from asset amounts (total volume).
  // The formula can be summarized as:
  // VWAP = ∑ (Price * Volume) / ∑ (Volume)
  calculateVWAPMarketPrice(
    orderSwapFills: Private.OrderSwapFill[],
    toAsset: Private.Asset,
    fromAsset: Private.Asset
  ): string {
    const {assetId: toAssetId, decimalPrecision: toAssetPrecision} = toAsset;
    const {decimalPrecision: fromAssetPrecision} = fromAsset;

    // Calculate the multiplier to adjust asset amounts to a common unit
    const decimalPrecisionDiff = toAssetPrecision - fromAssetPrecision;
    const unitPriceDiffMultiplier = new Big(10).pow(
      Math.abs(decimalPrecisionDiff)
    );

    const {cumulativeVolume, cumulativeDisplayUnitPriceTimesVolume} =
      orderSwapFills.reduce(
        ({cumulativeVolume, cumulativeDisplayUnitPriceTimesVolume}, order) => {
          // Determine the volume and indivisibleFromPrice tod on asset matching
          const {toVolume, indivisibleFromPrice} =
            order.toAssetId === toAssetId
              ? {
                  toVolume: new Big(order.toAssetAmountFilled.toString()),
                  indivisibleFromPrice: new Big(order.price),
                }
              : {
                  toVolume: new Big(order.fromAssetAmountFilled.toString()),
                  indivisibleFromPrice: new Big(1).div(new Big(order.price)),
                };

          // Determine the display unit from price
          const displayUnitFromPrice =
            decimalPrecisionDiff > 0
              ? indivisibleFromPrice.mul(unitPriceDiffMultiplier)
              : indivisibleFromPrice.div(unitPriceDiffMultiplier);

          // Calculate price times volume for the VWAP calculation
          const displayUnitPriceTimesVolume =
            displayUnitFromPrice.mul(toVolume);

          // Return the new cumulative values
          return {
            cumulativeDisplayUnitPriceTimesVolume:
              cumulativeDisplayUnitPriceTimesVolume.plus(
                displayUnitPriceTimesVolume
              ),
            cumulativeVolume: cumulativeVolume.plus(toVolume),
          };
        },
        {
          cumulativeVolume: new Big(0),
          cumulativeDisplayUnitPriceTimesVolume: new Big(0),
        }
      );

    // Avoid division by zero
    if (cumulativeVolume.eq(0)) {
      return '0';
    }

    // Calculate the VWAP
    const volumeWeightedAveragePrice =
      cumulativeDisplayUnitPriceTimesVolume.div(cumulativeVolume);

    return volumeWeightedAveragePrice.toString();
  }

  calculateDisplayUnitPrice(
    decimalPrecisionDiff: number,
    unitPriceDiffMultiplier: Big,
    indivisiblePrice: Big
  ): Big {
    const displayUnitPrice =
      decimalPrecisionDiff > 0
        ? indivisiblePrice.mul(unitPriceDiffMultiplier)
        : indivisiblePrice.div(unitPriceDiffMultiplier);

    return displayUnitPrice;
  }

  calculateUnitPriceDiffMultiplier(
    toAssetDecimalPrecision: number,
    fromAssetDecimalPrecision: number
  ): UnitPriceDiffMultiplier {
    const decimalPrecisionDiff = subtract(
      toAssetDecimalPrecision,
      fromAssetDecimalPrecision
    );
    const unitPriceDiffMultiplier = new Big(10).pow(
      Math.abs(decimalPrecisionDiff)
    );

    return {
      decimalPrecisionDiff,
      unitPriceDiffMultiplier,
    };
  }
}
