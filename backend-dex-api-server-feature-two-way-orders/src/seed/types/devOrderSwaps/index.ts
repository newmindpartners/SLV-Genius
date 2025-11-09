import {Prisma, OrderSwap} from '@prisma/client';

export type DevOrderSwapsExports = {
  events: Prisma.EventCreateManyInput[];
  orderSwaps: OrderSwap[];
};

export const isDevOrderSwapsExport = (
  fileImport: unknown
): fileImport is DevOrderSwapsExports => {
  /**
   * Make sure this captures all required keys in `DevOrderSwapsExports`
   * In an ideal world we would make TypeScript enforce this for us :)
   */
  if (typeof fileImport === 'object' && fileImport !== null) {
    const requiredKeys = ['events', 'orderSwaps'] as const;
    return requiredKeys.reduce((acc, x) => acc && x in fileImport, true);
  }
  return false;
};
