import {inject, injectable, singleton} from 'tsyringe';

import {
  clamp,
  divide,
  filter,
  first,
  get,
  gte,
  initial,
  last,
  lte,
  multiply,
  omit,
  orderBy,
  size,
  isEqual,
  union,
  intersection,
  isEmpty,
  flatMap,
  uniq,
} from 'lodash';

import * as loFp from 'lodash/fp';

import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';
import {isValidOrderSwap} from '~/domain/models/private';

import {OrderSwapRepository} from '~/domain/repositories';

import {ErrorCode} from '~/domain/errors';
import {PersistenceError} from '../persistence.error';

import {determineSwapOrderSortByParameter} from '~/domain/utils/orderSwap.util';

import {isSomeEmpty, update} from '~/domain/utils/object.util';
import {OrderSwapExclusionCache} from '~/implementation/redis/repositories/orderSwapExclusionCache';

function getOrderSwapBestAvailableWhereInput(
  toAssetId: string,
  fromAssetId: string,
  toAssetAmountMinFillRequirement: bigint,
  currentDate: Date,
  excludedOrderSwapUtxoRefIndexPairs: Record<string, unknown>[],
  walletStakeKeyHash?: string,
  fromAssetAmountMinFillRequirement?: bigint
): Prisma.Prisma.OrderSwapWhereInput {
  const toAssetConditions = {
    toAssetId: toAssetId,
    toAssetAmountTotalRemaining: {gte: toAssetAmountMinFillRequirement},
  };

  const fromAssetConditions = {
    fromAssetId: fromAssetId,
    fromAssetAmountTotalRemaining: {gte: fromAssetAmountMinFillRequirement},
  };

  const orderStatusConditions = {
    orderType: Prisma.OrderSwapOrderType.LIMIT,
    orderStatus: Prisma.OrderStatus.OPEN,
  };

  const timeWindowConditions = [
    {effectiveFromDate: null, effectiveUntilDate: null},
    {effectiveFromDate: {lte: currentDate}, effectiveUntilDate: null},
    {effectiveFromDate: null, effectiveUntilDate: {gte: currentDate}},
    {
      effectiveFromDate: {lte: currentDate},
      effectiveUntilDate: {gte: currentDate},
    },
  ];

  const userExclusionCondition = walletStakeKeyHash
    ? {NOT: {user: {walletStakeKeyHash}}}
    : {};

  return {
    ...toAssetConditions,
    ...fromAssetConditions,
    ...orderStatusConditions,
    ...userExclusionCondition,
    OR: timeWindowConditions,
    NOT: excludedOrderSwapUtxoRefIndexPairs,
  };
}

function getFilteredOrdersExcludingHighPricedAboveSlippagePercent(
  firstOrderSwap: Private.OrderSwap | undefined,
  orderSwaps: Private.OrderSwap[],
  slippagePercent: number,
  priceOrderBy: 'desc' | 'asc'
) {
  if (firstOrderSwap) {
    const comparisonOperator = priceOrderBy === 'desc' ? gte : lte;
    const boundOperator = priceOrderBy === 'desc' ? divide : multiply;

    // lower or upper bound depending on trade direction
    const bound =
      firstOrderSwap.price / (1 + boundOperator(slippagePercent, 100));

    return filter(orderSwaps, ({price}) => {
      return comparisonOperator(price, bound);
    });
  } else {
    return [];
  }
}

export const getListOfOrderSwapUtxoRefIndexes = loFp.flow(
  loFp.map(loFp.pick(['utxoReferenceIndex', 'utxoReferenceTransactionHash'])),
  loFp.filter(isSomeEmpty),
  loFp.map(update('utxoReferenceIndex', loFp.toNumber))
);

@singleton()
@injectable()
export class OrderSwapRepositoryPrisma implements OrderSwapRepository {
  constructor(
    @inject('OrderSwapExclusionCache')
    private readonly orderSwapExclusionCache: OrderSwapExclusionCache
  ) {}

  async createOrUpdateOrderSwap(
    prisma: Prisma.Prisma.TransactionClient,
    orderSwapData: Private.OrderSwap
  ): Promise<Prisma.OrderSwap> {
    const {userId, orderSwapId, ...rest} = orderSwapData;

    const optionalUserId = userId
      ? {
          user: {
            connect: {
              userId,
            },
          },
        }
      : {};

    const orderSwapCreate: Prisma.Prisma.OrderSwapCreateInput = {
      updated: new Date(),

      orderSwapId,

      ...omit(rest, 'updated'),

      ...optionalUserId,
    };

    const savedOrderSwap = await prisma.orderSwap.upsert({
      where: {orderSwapId},
      create: orderSwapCreate,
      update: orderSwapCreate,
    });

    return savedOrderSwap;
  }

  async updateOrderSwap(
    prisma: Prisma.Prisma.TransactionClient,
    orderSwapId: string,
    orderSwapData: Private.OrderSwapUpdate
  ): Promise<Prisma.OrderSwap> {
    const savedOrderSwap = await prisma.orderSwap.update({
      where: {orderSwapId: orderSwapId},
      data: {
        updated: new Date(),
        ...orderSwapData,
      },
    });

    return savedOrderSwap;
  }

  async createOrReplaceOrderSwapFills(
    prisma: Prisma.Prisma.TransactionClient,
    orderSwapWithFills: Private.OrderSwapWithFills
  ): Promise<void> {
    const {orderSwapId} = orderSwapWithFills;

    await prisma.orderSwapFill.deleteMany({
      where: {
        orderSwapId,
      },
    });

    const {orderSwapFills} = orderSwapWithFills;

    await prisma.orderSwapFill.createMany({
      data: orderSwapFills,
    });
  }

  async getOrderSwapByOrderId(
    prisma: Prisma.Prisma.TransactionClient,
    orderSwapId: string
  ): Promise<Private.OrderSwap | null> {
    return await prisma.orderSwap.findUnique({
      where: {orderSwapId},
    });
  }

  async getOrderSwapByOrderIdOrThrow(
    prisma: Prisma.Prisma.TransactionClient,
    orderSwapId: string
  ): Promise<Private.OrderSwap> {
    const orderSwap = await this.getOrderSwapByOrderId(prisma, orderSwapId);
    if (orderSwap) {
      return orderSwap;
    } else {
      throw new Error(ErrorCode.ORDER__NOT_FOUND);
    }
  }

  async getFirstOrderSwapByAssetIdPairAndUserId(
    prisma: Prisma.Prisma.TransactionClient,
    assetIdPair: [string, string],
    userId: string
  ): Promise<Prisma.OrderSwap | null> {
    const firstOrderSwap = await prisma.orderSwap.findFirst({
      where: {
        OR: [
          {toAssetId: assetIdPair[0], fromAssetId: assetIdPair[1]},
          {toAssetId: assetIdPair[1], fromAssetId: assetIdPair[0]},
        ],
        userId,
      },
      orderBy: {
        orderDate: 'asc',
      },
    });

    return firstOrderSwap;
  }

  async listOrderSwaps(
    prisma: Prisma.Prisma.TransactionClient,
    query: Private.OrderSwapQuery,
    listOrderCountLimit: number,
    walletStakeKeyHash: string | null
  ): Promise<Private.PaginatedResults<Private.ValidOrderSwap>> {
    const cursorId = 'orderSwapId';
    const {orderSwap} = prisma;

    const {
      sortSwapOrders,
      filterByAssetId,
      filterByToAssetId,
      filterByFromAssetId,
      filterByCreatedLte,
      filterByCreatedGte,
      filterByOrderSwapType,
      filterByOrderSwapStatus,
      filterByMinPrice,
      filterByMaxPrice,
    } = query;

    const allTradingPairBaseQuoteAssetIds = await prisma.tradingPair.findMany({
      select: {
        baseAssetId: true,
        quoteAssetId: true,
      },
    });

    const allTradingPairAssetIds: string[] = uniq(
      flatMap(
        allTradingPairBaseQuoteAssetIds,
        ({baseAssetId, quoteAssetId}) => [baseAssetId, quoteAssetId]
      )
    );

    const userCondition: Prisma.Prisma.OrderSwapWhereInput = walletStakeKeyHash
      ? {user: {walletStakeKeyHash}}
      : {};

    const orderTypeCondition: Private.OrderSwapOrderType[] = [
      'FILL_DIRECT',
      'FILL_BEST_AVAILABLE',
      'LIMIT',
    ];

    const orderByCondition = determineSwapOrderSortByParameter(sortSwapOrders);

    /**
     * These are the assets that are allowed to query for.
     * It is limited to the assets that exist in our trading pairs to prevent
     * leaking orders for assets which we do not support, but that could have been
     * ingested into our application.
     */
    const allowedAssetIds = allTradingPairAssetIds;

    const toAssetIdsToInclude = union(filterByToAssetId, filterByAssetId);
    const fromAssetIdsToInclude = union(filterByFromAssetId, filterByAssetId);

    const toFromAssetIdFilterCondition = {
      toAssetId: {
        in: isEmpty(toAssetIdsToInclude)
          ? allowedAssetIds
          : intersection(toAssetIdsToInclude, allowedAssetIds),
      },
      fromAssetId: {
        in: isEmpty(fromAssetIdsToInclude)
          ? allowedAssetIds
          : intersection(fromAssetIdsToInclude, allowedAssetIds),
      },
    };

    const createdCondition =
      filterByCreatedLte || filterByCreatedGte
        ? {
            created: {
              ...(filterByCreatedLte
                ? {lte: new Date(filterByCreatedLte)}
                : {}),
              ...(filterByCreatedGte
                ? {gte: new Date(filterByCreatedGte)}
                : {}),
            },
          }
        : {};

    const orderSwapTypeCondition = filterByOrderSwapType
      ? {orderType: filterByOrderSwapType}
      : {orderType: {in: orderTypeCondition}};

    const orderSwapStatusCondition = filterByOrderSwapStatus
      ? {orderStatus: filterByOrderSwapStatus as Prisma.OrderStatus}
      : {orderStatus: {not: null}};

    const minPriceCondition = filterByMinPrice
      ? {price: {gte: parseFloat(filterByMinPrice)}}
      : {};

    const maxPriceCondition = filterByMaxPrice
      ? {price: {lte: parseFloat(filterByMaxPrice)}}
      : {};

    const orderSwapWhereInput: Prisma.Prisma.OrderSwapWhereInput = {
      ...userCondition,
      ...toFromAssetIdFilterCondition,
      ...createdCondition,
      ...orderSwapTypeCondition,
      ...orderSwapStatusCondition,
      ...minPriceCondition,
      ...maxPriceCondition,
    };

    const cursor = query.cursor ? {[cursorId]: query.cursor} : undefined;

    const responsiveTakeDefault = 10;
    const desiredTakeOrDefault = clamp(
      Number(query.count || responsiveTakeDefault),
      0,
      listOrderCountLimit
    );
    const forwardTake = desiredTakeOrDefault + 1;
    const backwardTake = -desiredTakeOrDefault;

    const count = await orderSwap.count({
      where: orderSwapWhereInput,
    });

    const forwardResults = await orderSwap.findMany({
      take: forwardTake,
      where: orderSwapWhereInput,
      cursor,
      orderBy: orderByCondition,
    });

    const hasNextResult = size(forwardResults) === forwardTake;

    const next = hasNextResult
      ? get(last(forwardResults), cursorId)
      : undefined;

    const adjustedForwardResults = hasNextResult
      ? initial(forwardResults)
      : forwardResults;

    const backwardResults = await orderSwap.findMany({
      take: backwardTake,
      skip: 1,
      where: orderSwapWhereInput,
      cursor,
      orderBy: orderByCondition,
    });

    const prevResult = first(backwardResults);
    const prev = cursor && prevResult ? prevResult[cursorId] : undefined;

    const validOrderSwaps = filter(adjustedForwardResults, isValidOrderSwap);

    if (adjustedForwardResults.length !== validOrderSwaps.length)
      throw new PersistenceError(ErrorCode.REPOSITORY_QUERY_ISSUE_DETECTED);

    const paginatedResults: Private.PaginatedResults<Private.ValidOrderSwap> = {
      prev,
      next,
      count,
      results: validOrderSwaps,
    };

    return paginatedResults;
  }

  async getOrderSwapCountByAssetPair(
    prisma: Prisma.Prisma.TransactionClient,
    userId: string,
    assetIdPair: [string, string],
    isDirectionlessAssetPair = false
  ): Promise<number> {
    const defaultDirection = {
      toAssetId: assetIdPair[0],
      fromAssetId: assetIdPair[1],
    };

    const reverseDirection = {
      toAssetId: defaultDirection.fromAssetId,
      fromAssetId: defaultDirection.toAssetId,
    };

    const assetIdWhereInput = isDirectionlessAssetPair
      ? {
          OR: [defaultDirection, reverseDirection],
        }
      : defaultDirection;

    return prisma.orderSwap.count({
      where: {
        ...assetIdWhereInput,
        user: {
          userId,
        },
      },
    });
  }

  async getOrderSwapByMintAssetId(
    prisma: Prisma.Prisma.TransactionClient,
    mintAssetId: string
  ): Promise<Private.OrderSwap | null> {
    return await prisma.orderSwap.findFirst({
      where: {
        mintAssetId,
      },
    });
  }

  async getOrderSwapsByMintAssetId(
    prisma: Prisma.Prisma.TransactionClient,
    mintAssetIds: string[]
  ): Promise<Private.OrderSwap[] | null> {
    return await prisma.orderSwap.findMany({
      where: {
        mintAssetId: {in: mintAssetIds},
      },
    });
  }

  async getOrderSwapsByUtxoRefs(
    prisma: Prisma.Prisma.TransactionClient,
    utxoRefs: Private.UtxoRef[]
  ): Promise<Private.OrderSwap[]> {
    return await prisma.orderSwap.findMany({
      where: {
        OR: utxoRefs,
      },
    });
  }

  async listOrderSwapsBestAvailableSingleFill(
    prisma: Prisma.Prisma.TransactionClient,
    toAssetId: string,
    fromAssetId: string,
    toAssetAmount: bigint,
    fromAssetAmount: bigint,
    slippagePercent: number,
    maximumNumberOfOrders: number,
    walletStakeKeyHash?: string
  ): Promise<Private.ValidOrderSwap[]> {
    if (
      (toAssetAmount === 0n && fromAssetAmount === 0n) ||
      (toAssetAmount > 0n && fromAssetAmount > 0n) // toAssetAmount XOR fromAssetAmount
    )
      throw Error(ErrorCode.INVALID_ORDER__TO_OR_FROM_ASSET_AMOUNT_REQUIRED);

    const priceOrderBy = toAssetAmount > 0n ? 'desc' : 'asc';

    const currentDate = new Date();

    const excludedOrderSwapCacheEntries =
      await this.orderSwapExclusionCache.getExcludedOrderSwapsUtxoRefs(
        toAssetId,
        fromAssetId
      );

    const excludedOrderSwapUtxoRefIndexPairs = getListOfOrderSwapUtxoRefIndexes(
      excludedOrderSwapCacheEntries
    );

    const whereClause = getOrderSwapBestAvailableWhereInput(
      toAssetId,
      fromAssetId,
      toAssetAmount / 3n,
      currentDate,
      excludedOrderSwapUtxoRefIndexPairs,
      walletStakeKeyHash,
      fromAssetAmount
    );

    const orderSwaps = await prisma.orderSwap.findMany({
      where: whereClause,
      orderBy: {
        price: priceOrderBy,
      },
      take: maximumNumberOfOrders,
    });

    const firstOrderSwap = first(orderSwaps);

    const filteredOrdersExcludingHighPricedAboveSlippagePercent =
      getFilteredOrdersExcludingHighPricedAboveSlippagePercent(
        firstOrderSwap,
        orderSwaps,
        slippagePercent,
        priceOrderBy
      );

    const filteredValidOrdersExcludingHighPriced = filter(
      filteredOrdersExcludingHighPricedAboveSlippagePercent,
      isValidOrderSwap
    );

    if (
      filteredOrdersExcludingHighPricedAboveSlippagePercent.length !== // before
      filteredValidOrdersExcludingHighPriced.length // after
    )
      throw new PersistenceError(ErrorCode.REPOSITORY_QUERY_ISSUE_DETECTED);

    return filteredValidOrdersExcludingHighPriced;
  }

  async listOrderSwapsBestAvailableMultiFillNaive(
    prisma: Prisma.Prisma.TransactionClient,
    toAssetId: string,
    fromAssetId: string,
    toAssetAmount: bigint,
    maximumNumberOfOrders: number,
    walletStakeKeyHash?: string
  ): Promise<Private.ValidOrderSwap[]> {
    if (toAssetAmount === 0n && toAssetAmount > 0)
      throw Error(ErrorCode.INVALID_ORDER__TO_OR_FROM_ASSET_AMOUNT_REQUIRED);

    const priceOrderBy = toAssetAmount > 0n ? 'desc' : 'asc';

    const currentDate = new Date();

    const excludedOrderSwapCacheEntries =
      await this.orderSwapExclusionCache.getExcludedOrderSwapsUtxoRefs(
        toAssetId,
        fromAssetId
      );

    const excludedOrderSwapUtxoRefIndexPairs = getListOfOrderSwapUtxoRefIndexes(
      excludedOrderSwapCacheEntries
    );

    const whereClause = getOrderSwapBestAvailableWhereInput(
      toAssetId,
      fromAssetId,
      toAssetAmount / 3n,
      currentDate,
      excludedOrderSwapUtxoRefIndexPairs,
      walletStakeKeyHash
    );

    const orderSwaps = await prisma.orderSwap.findMany({
      where: whereClause,
      orderBy: {
        price: priceOrderBy,
      },
      take: maximumNumberOfOrders,
    });

    const validOrderSwaps = filter(orderSwaps, isValidOrderSwap);

    if (
      orderSwaps.length !== // before
      validOrderSwaps.length // after
    )
      throw new PersistenceError(ErrorCode.REPOSITORY_QUERY_ISSUE_DETECTED);

    return validOrderSwaps;
  }

  async listOrderSwapsBestAvailableMultiFillKnapsack(
    prisma: Prisma.Prisma.TransactionClient,
    toAssetId: string,
    fromAssetId: string,
    toAssetAmount: bigint,
    maximumNumberOfOrders: number,
    walletStakeKeyHash?: string
  ): Promise<Private.BestAvailableOrderSwapWithAlternativeOrders> {
    if (toAssetAmount === 0n && toAssetAmount > 0)
      throw Error(ErrorCode.INVALID_ORDER__TO_OR_FROM_ASSET_AMOUNT_REQUIRED);

    const excludedOrderSwapCacheEntries =
      await this.orderSwapExclusionCache.getExcludedOrderSwapsUtxoRefs(
        toAssetId,
        fromAssetId
      );

    const excludedOrderSwapUtxoRefIndexPairs = getListOfOrderSwapUtxoRefIndexes(
      excludedOrderSwapCacheEntries
    );

    // Check if there are any UTXO pairs to exclude
    const hasUtxoExclusions = excludedOrderSwapUtxoRefIndexPairs.length > 0;

    // Create a condition for each excluded UTXO pair
    const exclusionConditions = excludedOrderSwapUtxoRefIndexPairs.map(pair => {
      return `(
        order_swap.utxo_reference_transaction_hash = '${pair.utxoReferenceTransactionHash}' AND
        order_swap.utxo_reference_index = ${pair.utxoReferenceIndex}
      )`;
    });

    // Combine individual conditions with 'OR' if any exclusions exist, otherwise an empty string
    const utxoExclusionConditions = hasUtxoExclusions
      ? `AND NOT (${exclusionConditions.join(' OR ')})`
      : '';

    const queriedOrders: {
      orderIds: string[];
      alternativeOrderIds: string[];
    }[] = await prisma.$queryRaw(Prisma.Prisma.sql`
      WITH RECURSIVE EligibleOrders AS (
        SELECT
            order_swap_id,
            to_asset_amount_total_remaining,
            from_asset_amount_total_remaining,
            price,
            ROW_NUMBER() OVER (ORDER BY price DESC) AS order_sequence
        FROM
            order_swap
        LEFT JOIN "user" ON order_swap.user_id = "user".user_id
        WHERE
            to_asset_id = ${toAssetId} AND
            from_asset_id = ${fromAssetId} AND
            order_type = 'LIMIT' AND
            order_status = 'OPEN' AND
            (effective_from_date IS NULL OR effective_from_date <= NOW()) AND
            (effective_until_date IS NULL OR effective_until_date >= NOW()) AND
            ("user".wallet_stake_key_hash IS DISTINCT FROM ${walletStakeKeyHash} OR "user".wallet_stake_key_hash IS NULL)
            ${Prisma.Prisma.raw(utxoExclusionConditions)}
      ),
      OrderCombinations AS (
        SELECT
            ARRAY[order_swap_id] AS order_ids,
            ARRAY[LEAST(to_asset_amount_total_remaining, ${toAssetAmount})] AS to_amounts_filled,
            ARRAY[LEAST(to_asset_amount_total_remaining, ${toAssetAmount}) * price] AS from_amounts_received,
            LEAST(to_asset_amount_total_remaining, ${toAssetAmount}) AS total_filled_amount,
            price * LEAST(to_asset_amount_total_remaining, ${toAssetAmount}) AS total_received_amount,
            1 AS num_orders,
            ARRAY[order_sequence] AS order_sequences
        FROM
            EligibleOrders

        UNION ALL

        SELECT
            oc.order_ids || eo.order_swap_id,
            oc.to_amounts_filled || ARRAY[LEAST(eo.to_asset_amount_total_remaining, ${toAssetAmount} - oc.total_filled_amount)],
            oc.from_amounts_received || ARRAY[LEAST(eo.to_asset_amount_total_remaining, ${toAssetAmount} - oc.total_filled_amount) * eo.price],
            oc.total_filled_amount + LEAST(eo.to_asset_amount_total_remaining, ${toAssetAmount} - oc.total_filled_amount),
            oc.total_received_amount + (eo.price * LEAST(eo.to_asset_amount_total_remaining, ${toAssetAmount} - oc.total_filled_amount)),
            oc.num_orders + 1,
            oc.order_sequences || eo.order_sequence
        FROM
            OrderCombinations oc
          JOIN EligibleOrders eo ON NOT eo.order_swap_id = ANY(oc.order_ids) AND eo.order_sequence > ALL(oc.order_sequences) AND oc.num_orders + 1 <= ${maximumNumberOfOrders} AND oc.total_filled_amount < ${toAssetAmount}
      ),
      OrderCombination AS (
          SELECT
              order_ids
          FROM
              OrderCombinations
          WHERE
              total_filled_amount >= ${toAssetAmount}
          ORDER BY
              total_received_amount DESC
          LIMIT 1
      ),
      AlternativeOrderCombination AS (
          SELECT
              order_ids AS alternative_order_ids
          FROM
              OrderCombinations
          ORDER BY
              total_received_amount DESC
          LIMIT 1
      )
      SELECT
          COALESCE((SELECT order_ids FROM OrderCombination), ARRAY[]::UUID[]) AS "orderIds",
          COALESCE((SELECT alternative_order_ids FROM AlternativeOrderCombination), ARRAY[]::UUID[]) AS "alternativeOrderIds";
    `);

    const {orderIds, alternativeOrderIds} = queriedOrders[0];

    const areOrderIdsEqual = isEqual(orderIds, alternativeOrderIds);

    const processOrderSwaps = async (orderIds: string[]) => {
      const orderSwaps = await prisma.orderSwap.findMany({
        where: {orderSwapId: {in: orderIds}},
      });

      const validOrderSwaps = filter(orderSwaps, isValidOrderSwap);

      if (orderSwaps.length !== validOrderSwaps.length) {
        throw new PersistenceError(ErrorCode.REPOSITORY_QUERY_ISSUE_DETECTED);
      }

      return orderBy(validOrderSwaps, ['price'], ['desc']);
    };

    const orderSwapsProcessed = await processOrderSwaps(orderIds);

    const alternativeOrderSwapsProcessed = areOrderIdsEqual
      ? []
      : await processOrderSwaps(alternativeOrderIds);

    return {
      result: orderSwapsProcessed,
      alternativeResult: alternativeOrderSwapsProcessed,
    };
  }
}
