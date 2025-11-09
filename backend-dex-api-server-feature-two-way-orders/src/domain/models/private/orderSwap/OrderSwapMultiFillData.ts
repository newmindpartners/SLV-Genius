import * as Prisma from '@prisma/client';

export type OrderSwapMultiFillData = {
  utxoReference: string;
  fillToAssetAmount: string;
  fillFromAssetAmount: string;
  filledOrderSwap: Prisma.OrderSwap;
};
