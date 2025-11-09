import * as Prisma from '@prisma/client';

export type AssetPair = {
  baseAsset: Prisma.Asset;
  quoteAsset: Prisma.Asset;
};
