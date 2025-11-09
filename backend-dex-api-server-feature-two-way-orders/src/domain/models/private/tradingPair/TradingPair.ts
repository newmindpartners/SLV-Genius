import {Prisma} from '@prisma/client';

export type TradingPair = Prisma.TradingPairGetPayload<{
  include: {
    baseAsset: true,
    quoteAsset: true
  };
}>;
