import {Prisma} from '@prisma/client';

export type OrderSale = Prisma.OrderSaleGetPayload<{
  include: {
    user: true;
    orderSaleEvent: {
      include: {
        transaction: {
          include: {
            transactionInput: true;
            transactionOutput: true;
          };
        };
      };
    };
  };
}>;

export type OrderSaleEntityWithOrderSaleProject = Prisma.OrderSaleGetPayload<{
  include: {
    user: true;
    round: {
      select: {
        orderSaleProject: {
          select: {
            distributionDate: true;
          };
        };
      };
    };
  };
}>;
