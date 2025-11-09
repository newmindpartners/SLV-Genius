import {inject, injectable, singleton} from 'tsyringe';

import {first, last} from 'lodash';

import {Prisma} from '@prisma/client';

import * as Private from '~/domain/models/private';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';
import {identity} from 'fp-ts/lib/function';

const prioritiseGensLiquidityPool = (
  liquidityPools: Private.LiquidityPool[]
) => {
  const gensLP = liquidityPools.find(lp =>
    lp.asset.find(asset => asset.asset.shortName === 'GENS')
  );

  return gensLP
    ? [
        gensLP,
        ...liquidityPools.filter(
          lp => lp.liquidityPoolId !== gensLP.liquidityPoolId
        ),
      ]
    : liquidityPools;
};

@singleton()
@injectable()
export class LiquidityPoolRepositoryPrisma {
  constructor(
    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper
  ) {}

  async getLiquidityPool(
    prisma: Prisma.TransactionClient,
    liquidityPoolId: string
  ): Promise<Private.LiquidityPool | null> {
    const liquidityPool = await prisma.liquidityPool.findFirst({
      where: {
        liquidityPoolId: liquidityPoolId,
      },
      include: {
        asset: {
          include: {
            asset: true,
          },
        },
      },
    });

    return liquidityPool;
  }

  async getLiquidityPoolByAssets(
    prisma: Prisma.TransactionClient,
    assetIds: string[]
  ): Promise<Private.LiquidityPool | null> {
    const [asset1Id, asset2Id] = assetIds;
    const liquidityPool = await prisma.liquidityPool.findFirst({
      where: {
        asset: {
          every: {
            assetId: {
              in: [asset1Id, asset2Id],
            },
          },
        },
      },
      include: {
        asset: {
          include: {
            asset: true,
          },
        },
      },
    });

    return liquidityPool;
  }

  async listLiquidityPools(
    prisma: Prisma.TransactionClient,
    query: Private.LiquidityPoolQuery,
    prioritiseGens: boolean
  ): Promise<Private.PaginatedResults<Private.LiquidityPool>> {
    const cursorId = 'liquidityPoolId';

    const cursor = query.cursor ? {[cursorId]: query.cursor} : undefined;

    const desiredTakeOrDefault = Number(query.count || 6);

    const forwardTake = desiredTakeOrDefault + 1;

    const backwardTake = -forwardTake;

    const count = await prisma.liquidityPool.count();

    const forwardResults = await prisma.liquidityPool.findMany({
      take: forwardTake,
      cursor,
      orderBy: {liquidityPoolId: 'asc'},
      include: {
        asset: {
          include: {
            asset: true,
          },
        },
      },
    });

    const reOrderLiquidityPools = prioritiseGens
      ? prioritiseGensLiquidityPool
      : identity;

    const reOrderedForwardResults = reOrderLiquidityPools(forwardResults);

    const nextResult = last(reOrderedForwardResults);

    const next = nextResult ? nextResult[cursorId] : undefined;

    const forwardResultsExist =
      reOrderedForwardResults.length > forwardTake - 1;

    if (forwardResultsExist) reOrderedForwardResults.pop();

    const backwardResults = await prisma.liquidityPool.findMany({
      take: backwardTake,
      skip: 1,
      cursor,
    });

    const prevResult = first(backwardResults);

    const prev = cursor && prevResult ? prevResult[cursorId] : undefined;

    const paginatedResults: Private.PaginatedResults<Private.LiquidityPool> = {
      prev,
      next,
      count,
      results: reOrderedForwardResults,
    };

    return paginatedResults;
  }
}
