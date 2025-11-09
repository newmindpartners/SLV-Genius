import {Prisma} from '@prisma/client';

export type OrderSaleEvent = Prisma.OrderSaleEventGetPayload<{
  include: {
    transaction: {
      include: {
        transactionInput: true;
        transactionOutput: true;
      };
    };
  };
}>;
