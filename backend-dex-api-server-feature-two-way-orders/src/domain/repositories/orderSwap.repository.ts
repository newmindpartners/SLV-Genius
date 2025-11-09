import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';

export interface OrderSwapRepository {
  getOrderSwapsByUtxoRefs(
    prisma: Prisma.Prisma.TransactionClient,
    utxoRefs: Private.UtxoRef[]
  ): Promise<Private.OrderSwap[]>;

  createOrUpdateOrderSwap(
    context: TransactionalContext,
    orderSwapData: Private.OrderSwapCreate
  ): Promise<Prisma.OrderSwap>;

  updateOrderSwap(
    context: TransactionalContext,
    orderSwapId: string,
    orderSwapData: Private.OrderSwapUpdate
  ): Promise<Prisma.OrderSwap>;

  createOrReplaceOrderSwapFills(
    context: TransactionalContext,
    orderSwapWithFills: Private.OrderSwapWithFills
  ): Promise<void>;

  getOrderSwapByOrderId(
    context: TransactionalContext,
    orderSwapId: string
  ): Promise<Private.OrderSwap | null>;

  getOrderSwapByOrderIdOrThrow(
    context: TransactionalContext,
    orderSwapId: string
  ): Promise<Private.OrderSwap>;

  getFirstOrderSwapByAssetIdPairAndUserId(
    prisma: Prisma.Prisma.TransactionClient,
    assetIdPair: [string, string],
    userId: string
  ): Promise<Private.OrderSwap | null>;

  listOrderSwaps(
    prisma: Prisma.Prisma.TransactionClient,
    query: Private.OrderSwapQuery,
    listOrderCountLimit: number,
    walletStakeKeyHash: string | null
  ): Promise<Private.PaginatedResults<Private.ValidOrderSwap>>;

  getOrderSwapCountByAssetPair(
    prisma: Prisma.Prisma.TransactionClient,
    userId: string,
    assetIdPair: [string, string],
    isDirectionlessAssetPair?: boolean
  ): Promise<number>;

  listOrderSwapsBestAvailableSingleFill(
    context: TransactionalContext,
    baseAssetId: string,
    quoteAssetId: string,
    baseAssetAmount: bigint,
    quoteAssetAmount: bigint,
    slippagePercent: number,
    maximumNumberOfOrders: number,
    walletStakeKeyHash?: string
  ): Promise<Private.ValidOrderSwap[]>;

  listOrderSwapsBestAvailableMultiFillNaive(
    context: TransactionalContext,
    baseAssetId: string,
    quoteAssetId: string,
    baseAssetAmount: bigint,
    maximumNumberOfOrders: number,
    walletStakeKeyHash?: string
  ): Promise<Private.ValidOrderSwap[]>;

  listOrderSwapsBestAvailableMultiFillKnapsack(
    context: TransactionalContext,
    baseAssetId: string,
    quoteAssetId: string,
    baseAssetAmount: bigint,
    maximumNumberOfOrders: number,
    walletStakeKeyHash?: string
  ): Promise<Private.BestAvailableOrderSwapWithAlternativeOrders>;

  getOrderSwapByMintAssetId(
    prisma: Prisma.Prisma.TransactionClient,
    mintAssetId: string
  ): Promise<Private.OrderSwap | null>;

  getOrderSwapsByMintAssetId(
    prisma: Prisma.Prisma.TransactionClient,
    mintAssetIds: string[]
  ): Promise<Private.OrderSwap[] | null>;
}
