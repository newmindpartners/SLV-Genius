import * as Prisma from '@prisma/client';

export const orderSwapOrderTypes = Prisma.OrderSwapOrderType;

export type OrderSwapOrderType =
  (typeof orderSwapOrderTypes)[keyof typeof orderSwapOrderTypes];
