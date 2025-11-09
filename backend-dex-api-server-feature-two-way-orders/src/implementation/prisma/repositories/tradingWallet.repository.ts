import {injectable, singleton} from 'tsyringe';

import {clamp, first, get, initial, last, size} from 'lodash';

import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';

import {TradingWalletRepository} from '~/domain/repositories/tradingWallet.repository';
import {determineTradingWalletOrderByCondition} from '~/domain/utils/tradingWallet.util';

@singleton()
@injectable()
export class TradingWalletRepositoryPrisma implements TradingWalletRepository {
  constructor() {}

  async getTradingWalletById(
    prisma: Prisma.Prisma.TransactionClient,
    tradingWalletId: string
  ): Promise<Private.TradingWallet | null> {
    return await prisma.tradingWallet.findUnique({
      where: {tradingWalletId},
      include: {
        tradingWalletUser: true,
        assetOne: true,
        assetTwo: true,
      },
    });
  }

  async listTradingWallets(
    prisma: Prisma.Prisma.TransactionClient,
    query?: Private.TradingWalletListQuery
  ): Promise<Private.PaginatedResults<Private.TradingWallet>> {
    const cursorId = 'tradingWalletId';

    const {cursor: tradingWalletIdCursor, count} = query ?? {};

    const cursor: Prisma.Prisma.TradingWalletFindManyArgs['cursor'] =
      tradingWalletIdCursor ? {[cursorId]: tradingWalletIdCursor} : undefined;

    const responsiveTakeDefault = 10;
    const listOrderCountLimit = 10;

    const desiredTakeOrDefault = clamp(
      Number(count || responsiveTakeDefault),
      0,
      listOrderCountLimit
    );
    const forwardTake = (count || responsiveTakeDefault) + 1;
    const backwardTake = -desiredTakeOrDefault;

    const whereInput = query
      ? this.getTradingWalletListWhereInputs(query)
      : undefined;

    const newCount = await prisma.tradingWallet.count({
      where: whereInput,
    });

    const orderByCondition = determineTradingWalletOrderByCondition(
      query?.sortTradingWalletOrderBy
    );

    const forwardResults = await prisma.tradingWallet.findMany({
      take: forwardTake,
      where: whereInput,
      include: {
        tradingWalletUser: true,
        assetOne: true,
        assetTwo: true,
      },
      cursor,
      orderBy: orderByCondition,
    });

    const hasNextResult = size(forwardResults) === forwardTake;

    const next = hasNextResult
      ? get(last(forwardResults), cursorId)
      : undefined;

    const tradingWallets = hasNextResult
      ? initial(forwardResults)
      : forwardResults;

    const backwardResults = await prisma.tradingWallet.findMany({
      take: backwardTake,
      skip: 1,
      where: whereInput,
      cursor,
      orderBy: orderByCondition,
    });

    const prevResult = first(backwardResults);
    const prev =
      tradingWalletIdCursor && prevResult ? prevResult[cursorId] : undefined;

    const paginatedResults: Private.PaginatedResults<Private.TradingWallet> = {
      prev,
      next,
      count: newCount,
      results: tradingWallets,
    };

    return paginatedResults;
  }

  private getTradingWalletListWhereInputs(
    query: Private.TradingWalletListQuery
  ): Prisma.Prisma.TradingWalletWhereInput {
    const {filterByAssetPair, filterByWalletStakeKeyHash} = query;

    const assetPairArray: string[] | undefined = filterByAssetPair?.split('-');

    const assetPair: [string, string] | null =
      assetPairArray?.length === 2
        ? [assetPairArray[0], assetPairArray[1]]
        : null;

    const userCondition: Prisma.Prisma.TradingWalletWhereInput =
      filterByWalletStakeKeyHash
        ? {
            tradingWalletFollower: {
              some: {
                user: {walletStakeKeyHash: filterByWalletStakeKeyHash},
              },
            },
          }
        : {};

    const assetPairCondition: Prisma.Prisma.TradingWalletWhereInput = assetPair
      ? {
          OR: [
            {assetOneId: assetPair[0], assetTwoId: assetPair[1]},
            {assetOneId: assetPair[1], assetTwoId: assetPair[0]},
          ],
        }
      : {};

    return {
      ...userCondition,
      ...assetPairCondition,
    };
  }

  async getTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    query: Private.TradingWalletQuery
  ): Promise<Private.TradingWallet> {
    return await prisma.tradingWallet.findUniqueOrThrow({
      where: {tradingWalletId: query.tradingWalletId},
      include: {
        tradingWalletUser: true,
        assetOne: true,
        assetTwo: true,
      },
    });
  }

  getTradingWalletUniqueWhereInputs(
    query: Private.TradingWalletQuery
  ): Prisma.Prisma.TradingWalletWhereUniqueInput {
    const {tradingWalletId} = query;

    return {
      tradingWalletId,
    };
  }

  async getOrCreateTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    tradingWalletData: Private.TradingWalletCreate
  ): Promise<Private.TradingWallet> {
    return await prisma.tradingWallet.upsert({
      where: {
        tradingWalletUserId_assetOneId_assetTwoId: {
          tradingWalletUserId: tradingWalletData.tradingWalletUserId,
          assetOneId: tradingWalletData.assetOneId,
          assetTwoId: tradingWalletData.assetTwoId,
        },
      },
      include: {
        tradingWalletUser: true,
        assetOne: true,
        assetTwo: true,
      },
      create: tradingWalletData,
      update: {},
    });
  }

  async createTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    tradingWalletData: Private.TradingWalletCreate
  ): Promise<Private.TradingWallet> {
    return await prisma.tradingWallet.create({
      data: tradingWalletData,
      include: {
        tradingWalletUser: true,
        assetOne: true,
        assetTwo: true,
      },
    });
  }

  async followTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    userId: string,
    tradingWalletId: string
  ): Promise<void> {
    await prisma.tradingWalletFollower.create({
      data: {
        user: {
          connect: {
            userId,
          },
        },
        tradingWallet: {
          connect: {
            tradingWalletId,
          },
        },
      },
    });
  }

  async updateTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    tradingWalletId: string,
    tradingWalletUpdate: Private.TradingWalletUpdate
  ): Promise<Private.TradingWallet> {
    return prisma.tradingWallet.update({
      where: {tradingWalletId},
      include: {
        tradingWalletUser: true,
        assetOne: true,
        assetTwo: true,
      },
      data: tradingWalletUpdate,
    });
  }
}
