import {Prisma} from '@prisma/client';

export type OrderSalePortfolioProject = Prisma.OrderSaleProjectGetPayload<{
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
        orderSale: {
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
        };
        roundWhitelist: true;
      };
    };
  };
}>;
