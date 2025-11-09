import {Prisma} from '@prisma/client';

export type LiquidityPool = Prisma.LiquidityPoolGetPayload<{
  include: {
    asset: {
      include: {
        asset: true;
      };
    };
  };
}>;
