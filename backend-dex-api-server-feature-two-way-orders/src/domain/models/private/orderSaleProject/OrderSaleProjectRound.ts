import {Prisma} from '@prisma/client';

export type OrderSaleProjectRound = Prisma.RoundGetPayload<{
  include: {
    roundWhitelist: true;
  };
}>;
