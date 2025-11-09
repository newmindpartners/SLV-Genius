import * as Seed from '..';

export type TradingPairGroupExports = {
  tradingPair: Seed.TradingPair;
};

export const isTradingPairGroupExports = (
  fileImport: unknown
): fileImport is TradingPairGroupExports => {
  if (typeof fileImport === 'object' && fileImport !== null) {
    const requiredKeys = ['tradingPair'] as const;
    return requiredKeys.every(key => key in fileImport);
  }
  return false;
};
