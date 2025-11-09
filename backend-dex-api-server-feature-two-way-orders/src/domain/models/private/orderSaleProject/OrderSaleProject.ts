import {Prisma} from '@prisma/client';

export type OrderSaleProject = Prisma.OrderSaleProjectGetPayload<{
  include: {
    project: {
      include: {
        asset: true;
      };
    };
    round: {
      orderBy: {
        number: 'asc';
      };
      include: {
        roundWhitelist: true;
      };
    };
  };
}>;
