import * as Seed from '..';

export type CommonGroupExports = {
  countries: Seed.Country[];
  user?: Seed.User;
  orderSaleBlacklistCountries?: Seed.OrderSaleBlacklistCountry[];
  adaAsset: Seed.Asset;
};

export const isCommonGroupExports = (
  fileImport: unknown
): fileImport is CommonGroupExports => {
  if (typeof fileImport === 'object' && fileImport !== null) {
    const requiredKeys = ['countries'] as const;
    return requiredKeys.every(key => key in fileImport);
  }
  return false;
};
