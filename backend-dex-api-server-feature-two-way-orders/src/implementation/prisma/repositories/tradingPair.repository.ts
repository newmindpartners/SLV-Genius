import {injectable, singleton} from 'tsyringe';

import {Prisma} from '@prisma/client';

import * as Private from '~/domain/models/private';

@singleton()
@injectable()
export class TradingPairRepositoryPrisma {
  constructor() {}

  async listTradingPairs(
    prisma: Prisma.TransactionClient
  ): Promise<{results: Private.TradingPair[]}> {
    const results = await prisma.tradingPair.findMany({
      include: {
        baseAsset: true,
        quoteAsset: true,
      },
    });

    return {
      results,
    };
  }

  async getTradingPairByAssetIdPair(
    prisma: Prisma.TransactionClient,
    [assetIdOne, assetIdTwo]: [string, string]
  ): Promise<Private.TradingPair | null> {
    return prisma.tradingPair.findFirst({
      include: {
        baseAsset: true,
        quoteAsset: true,
      },
      where: {
        OR: [
          {baseAssetId: assetIdOne, quoteAssetId: assetIdTwo},
          {baseAssetId: assetIdTwo, quoteAssetId: assetIdOne},
        ],
      },
    });
  }
}
