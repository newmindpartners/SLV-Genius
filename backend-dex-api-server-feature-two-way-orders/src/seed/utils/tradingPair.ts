import * as Seed from '~/seed/types';

export const createTradingPair = (
  tradingPairId: string,
  [baseAssetId, quoteAssetId]: [string, string]
): Seed.TradingPair => ({
  tradingPairId,
  baseAsset: {
    connect: {assetId: baseAssetId},
  },
  quoteAsset: {
    connect: {assetId: quoteAssetId},
  },
});
