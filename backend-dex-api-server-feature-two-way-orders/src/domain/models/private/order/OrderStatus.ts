import * as Prisma from '@prisma/client';

export const OrderStatus = Prisma.OrderStatus;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
