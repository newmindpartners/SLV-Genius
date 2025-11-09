import {inject, injectable, singleton} from 'tsyringe';
import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';
import {OrderBookRepository} from '~/domain/repositories/orderBook.repository';
import {ErrorCode} from '~/domain/errors';
import {filter} from 'lodash';
import {isValidOrderSwap} from '~/domain/models/private';
import {PersistenceError} from '../persistence.error';
import {OrderSwapExclusionCache} from '~/implementation/redis/repositories/orderSwapExclusionCache';
import {getListOfOrderSwapUtxoRefIndexes} from './orderSwap.repository';

@singleton()
@injectable()
export class OrderBookRepositoryPrisma implements OrderBookRepository {
  constructor(
    @inject('OrderSwapExclusionCache')
    private readonly orderSwapExclusionCache: OrderSwapExclusionCache
  ) {}

  async getLastNOrderSwapFillsForAssetPair(
    prisma: Prisma.Prisma.TransactionClient,
    toAssetId: string,
    fromAssetId: string,
    marketPriceOrderQueryTakeLimit: number
  ): Promise<Private.OrderSwapFill[]> {
    const result = await prisma.orderSwapFill.findMany({
      where: {
        OR: [
          {
            toAssetId: toAssetId,
            fromAssetId: fromAssetId,
          },
          {
            toAssetId: fromAssetId,
            fromAssetId: toAssetId,
          },
        ],
      },
      orderBy: {
        transactionDateFill: 'desc',
      },
      take: marketPriceOrderQueryTakeLimit,
    });

    return result;
  }

  async getSortedOpenOrderBookSwapsByAssetIds(
    prisma: Prisma.Prisma.TransactionClient,
    baseAssetId: string,
    quoteAssetId: string
  ): Promise<Private.ValidOrderSwap[]> {
    const currentDate = new Date();

    const excludedOrderSwaps =
      await this.orderSwapExclusionCache.getExcludedOrderSwapsUtxoRefs(
        baseAssetId,
        quoteAssetId
      );

    const excludedOrderSwapUtxoRefIndexPairs =
      getListOfOrderSwapUtxoRefIndexes(excludedOrderSwaps);

    const orderTypeLimit: Prisma.Prisma.OrderSwapWhereInput = {
      orderType: 'LIMIT',
    };

    const orderStatusOpen: Prisma.Prisma.OrderSwapWhereInput = {
      orderStatus: Private.OrderSwapStatus.OPEN,
    };

    const orders: Prisma.Prisma.OrderSwapWhereInput = {
      toAssetId: baseAssetId,
      fromAssetId: quoteAssetId,
      ...orderTypeLimit,
      ...orderStatusOpen,
    };

    const ordersEffectiveAlways: Prisma.Prisma.OrderSwapWhereInput = {
      ...orders,
      // exclude time limit orders
      effectiveFromDate: null,
      effectiveUntilDate: null,
    };

    const ordersEffectiveFrom: Prisma.Prisma.OrderSwapWhereInput = {
      ...orders,
      // include time limit orders where effective from date is before now
      effectiveFromDate: {lte: currentDate},
      effectiveUntilDate: null,
    };

    const ordersEffectiveUntil: Prisma.Prisma.OrderSwapWhereInput = {
      ...orders,
      // include time limit orders where effective until date is after now
      effectiveFromDate: null,
      effectiveUntilDate: {gte: currentDate},
    };

    const ordersEffectiveBetween: Prisma.Prisma.OrderSwapWhereInput = {
      ...orders,
      // include time limit orders where now is between effective from and until dates
      effectiveFromDate: {lte: currentDate},
      effectiveUntilDate: {gte: currentDate},
    };

    const sortedOpenOrderSwaps = await prisma.orderSwap.findMany({
      where: {
        OR: [
          ordersEffectiveAlways,
          ordersEffectiveFrom,
          ordersEffectiveUntil,
          ordersEffectiveBetween,
        ],
        NOT: excludedOrderSwapUtxoRefIndexPairs,
      },
      orderBy: {
        price: 'desc',
      },
      take: 15,
    });

    const validSortedOpenOrderSwaps = filter(
      sortedOpenOrderSwaps,
      isValidOrderSwap
    );

    if (sortedOpenOrderSwaps.length !== validSortedOpenOrderSwaps.length)
      throw new PersistenceError(ErrorCode.REPOSITORY_QUERY_ISSUE_DETECTED);

    return validSortedOpenOrderSwaps;
  }
}
