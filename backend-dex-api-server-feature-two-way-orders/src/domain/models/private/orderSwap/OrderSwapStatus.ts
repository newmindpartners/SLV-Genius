import * as Prisma from '@prisma/client';

export const OrderSwapStatus = Prisma.OrderStatus;

export type OrderSwapStatusTypes =
  (typeof OrderSwapStatus)[keyof typeof OrderSwapStatus];
