import { flatMap, uniqBy } from 'lodash';
import { Asset, TradingPair } from '~/redux/api';
import { div, round, trimTrailingZeros } from '~/utils/mathUtils';

import { PRICE_DECIMALS } from './swapOrderUtils';

export type AssetsPair<T> = {
  from: T;
  to: T;
};

export type TradingPairAssets = AssetsPair<TradingAsset | null>;

export type TradingPairAmounts = AssetsPair<string | null>;

export const getTradingPairPrice = (
  fromAsset: Asset | null,
  toAsset: Asset | null,

  fromAmount: string | null,
  toAmount: string | null,

  selectedTradingPair: TradingPair | null,
): string | null => {
  if (!fromAsset || !toAsset) return null;
  if (!fromAmount || !toAmount) return null;
  if (!selectedTradingPair) return null;

  const isFromAssetDirectionCorrespondsTradingPair =
    fromAsset?.assetId === selectedTradingPair.quoteAsset.assetId;

  const isToAssetDirectionCorrespondsTradingPair =
    toAsset?.assetId === selectedTradingPair.baseAsset.assetId;
  const quoteAmount = isFromAssetDirectionCorrespondsTradingPair ? fromAmount : toAmount;
  const baseAmount = isToAssetDirectionCorrespondsTradingPair ? toAmount : fromAmount;
  const quotePrice = div(quoteAmount, baseAmount);

  return quotePrice;
};

export type TradingAsset = Asset & {
  allowedAssets: Asset[];
};

export const defaultAdaPrecision = 6;
export const defaultMarketDataPricePrecisionDetailed = 16;

export const removeDuplicateAssets = (assets: Asset[]) => uniqBy(assets, 'assetId');

const getUniqueAssets = (tradingPairs: TradingPair[]) => {
  const allAssets = flatMap(tradingPairs, (tradingPair) => [
    tradingPair.baseAsset,
    tradingPair.quoteAsset,
  ]);

  return uniqBy(allAssets, 'assetId');
};

const getAllowedAssetsByTradingPairs = (
  currentAsset: Asset,
  tradingPairs: TradingPair[],
): Asset[] => {
  const allowedAssets = tradingPairs.filter((tradingPair) =>
    isAssetInTradingPair(currentAsset, tradingPair),
  );

  const uniqueAssets = getUniqueAssets(allowedAssets).filter(
    (asset) => asset !== currentAsset,
  );

  return uniqueAssets;
};

const isAssetInTradingPair = (asset: Asset, tradingPair: TradingPair): boolean => {
  return (
    tradingPair.baseAsset.assetId === asset.assetId ||
    tradingPair.quoteAsset.assetId === asset.assetId
  );
};

export const getTradingAssetsFromTradingPairs = (tradingPairs: TradingPair[]) => {
  const uniqueAssets = getUniqueAssets(tradingPairs);

  const result = uniqueAssets.map((asset) => ({
    ...asset,
    allowedAssets: getAllowedAssetsByTradingPairs(asset, tradingPairs),
  }));

  return result;
};

export const getDefaultTradingPair = (
  tradingAssets: TradingAsset[],
  defaultFromAssetShortname: string,
  defaultToAssetShortname: string,
): TradingPairAssets => {
  if (tradingAssets?.length) {
    const from =
      tradingAssets.find(
        (asset: TradingAsset) => asset.shortName === defaultFromAssetShortname,
      ) || null;
    const to =
      tradingAssets.find(
        (asset: TradingAsset) => asset.shortName === defaultToAssetShortname,
      ) || null;

    return {
      from,
      to,
    };
  } else {
    return {
      from: null,
      to: null,
    };
  }
};

export const findTradingPair = (
  from: TradingAsset | Asset | null,
  to: TradingAsset | Asset | null,
  tradingPairs: TradingPair[],
) => {
  if (!from || !to) return null;

  const tradingPair = tradingPairs.find((tradingPair) => {
    const assetsInTradingPair = [
      tradingPair.baseAsset.assetId,
      tradingPair.quoteAsset.assetId,
    ];
    return (
      assetsInTradingPair.includes(from?.assetId) &&
      assetsInTradingPair.includes(to?.assetId)
    );
  });

  return tradingPair || null;
};

export const getTradingPairString = (tradingPair: TradingPair) =>
  `${tradingPair.baseAsset.assetId}-${tradingPair.quoteAsset.assetId}`;

export const inverseTradingPairAssets = (pair: TradingPairAssets): TradingPairAssets => ({
  from: pair.to,
  to: pair.from,
});

export const formatMarketPrice = (marketPrice: string) => ({
  detailed: trimTrailingZeros(
    round(marketPrice, defaultMarketDataPricePrecisionDetailed),
  ),
  rounded: trimTrailingZeros(round(marketPrice, PRICE_DECIMALS)),
});
