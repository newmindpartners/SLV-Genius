import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import * as Prisma from '@prisma/client';
import * as Oura from '~/domain/models/oura';
import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

export interface OrderSaleRepository {
  /**
   Create an Open Unsigned Sale Order
   *
   * @param context transactional context
   * @param user user
   * @param unsignedOrderSale sale order data to create an order
   * @param pendingTransaction core transaction input / output
   *
   * @return created unsigned sale order
   */
  createOrderSaleOpen(
    context: TransactionalContext,
    user: Private.User,
    unsignedOrderSale: Public.UnsignedSaleOrder,
    pendingTransaction: Core.Transaction
  ): Promise<Prisma.OrderSaleEvent>;

  /**
   * Create a Cancel Unsigned Sale Order   *
   *
   * @param context transactional context
   * @param unsignedOrderSale sale order data to cancel an order
   * @param pendingTransaction core transaction input / output

   * @return created a cancel unsigned sale order
   */
  createOrderSaleCancel(
    context: TransactionalContext,
    unsignedOrderSale: Public.UnsignedSaleOrder,
    pendingTransaction: Core.Transaction
  ): Promise<Prisma.OrderSaleEvent>;

  /**
   * List All Sale Orders, quering project where there is at least one order per user
   *
   * @param context transactional context
   * @param ownerWalletStakeKeyHash owner of wallet is determined by the stake part of the wallet address
   *
   * @return list of all portfolio project with user orders sale, if there are
   */
  allUserProjectsWithOrdersSaleAndSubmittedTransactionByOwnerWalletStakeKeyHash(
    context: TransactionalContext,
    ownerWalletStakeKeyHash: string
  ): Promise<Private.OrderSalePortfolioProject[]>;

  /**
   * Get an order by order id
   *
   * @param context transactional context
   * @param orderId an id that identify an order
   *
   * @return order of throw an exception if order was not found
   */
  getOrderSaleByOrderId(
    context: TransactionalContext,
    orderId: string
  ): Promise<Private.OrderSale>;

  /**
   * Get a sale order and its associated order sale project by order id
   *
   * @param context transactional context
   * @param orderId an id that identifies a sale order
   *
   * @return a sale order and its associated order sale project or throw an exception if the sale order was not found
   */
  getOrderSaleWithOrderSaleProjectByOrderId(
    context: TransactionalContext,
    orderId: string
  ): Promise<Private.OrderSaleEntityWithOrderSaleProject>;

  /**
   * Get an sale order by one of its event ids
   *
   * @param prisma
   * @param orderSaleEventId
   */
  getOrderSaleByEventId(
    prisma: TransactionalContext,
    orderSaleEventId: string
  ): Promise<Private.OrderSale & {orderSaleEvent: Prisma.OrderSaleEvent[]}>;

  /**
   * Return true if an order event exists with an event id
   *
   * @param context transactional context
   * @param eventId an id that identify an order
   *
   * @return order of throw an exception if order was not found
   */
  existsOrderSaleEventByEventId(
    context: TransactionalContext,
    eventId: string
  ): Promise<boolean>;

  /**
   * saveOrderSaleEventOpen
   * @param prisma
   * @param orderSaleId
   * @param baseAssetId
   * @param baseAssetAmount
   * @param pendingTransaction
   */
  saveOrderSaleEventOpen(
    prisma: TransactionalContext,
    orderSaleId: string,
    baseAssetId: string,
    baseAssetAmount: string,
    pendingTransaction: Core.Transaction
  ): Promise<Prisma.OrderSaleEvent>;

  /**
   * saveOrderSaleEventCancel
   * @param prisma
   * @param orderSaleId
   * @param baseAssetId
   * @param baseAssetAmount
   * @param pendingTransaction
   */
  saveOrderSaleEventCancel(
    prisma: TransactionalContext,
    orderSaleId: string,
    baseAssetId: string,
    baseAssetAmount: string,
    pendingTransaction: Core.Transaction
  ): Promise<Prisma.OrderSaleEvent>;

  /**
   * createOrderSaleEventFill
   * @param prisma
   * @param orderSaleId
   * @param baseAssetId
   * @param baseAssetAmount
   * @param transactionHash
   */
  createOrderSaleEventFill(
    prisma: TransactionalContext,
    orderSaleId: string,
    baseAssetId: string,
    baseAssetAmount: string,
    transactionHash: string
  ): Promise<Prisma.OrderSaleEvent>;

  /**
   * Return a core "order reference" used to cancel that order
   *
   * @param context transactional context
   * @param orderId an id that identify an order
   * @param scriptAddress generated script address
   *
   * @return an internal "order reference" to cancel that order
   */
  getOrderSaleCancelReference(
    context: TransactionalContext,
    orderId: string,
    scriptAddress: string
  ): Promise<string>;

  /**
   * Update an order with a transaction received from Oura
   *
   * @param context transactional context
   * @param eventContext event context containing block data
   * @param transaction a transaction received from oura
   */
  updateFillTransactionOrders(
    context: TransactionalContext,
    eventContext: Oura.EventContext,
    transaction: Oura.Transaction
  ): Promise<void>;
}
