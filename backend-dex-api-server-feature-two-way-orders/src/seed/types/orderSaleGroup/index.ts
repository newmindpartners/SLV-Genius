import * as Seed from '..';

export type OrderSaleGroupExports = {
  orderSaleProject: Seed.OrderSaleProject;
};

export const isOrderSaleGroupExports = (
  fileImport: unknown
): fileImport is OrderSaleGroupExports => {
  if (typeof fileImport === 'object' && fileImport !== null) {
    const requiredKeys = ['orderSaleProject'] as const;
    return requiredKeys.every(key => key in fileImport);
  }
  return false;
};
