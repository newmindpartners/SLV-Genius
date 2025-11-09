import 'reflect-metadata';

import {
  Dictionary,
  filter,
  find,
  flow,
  groupBy,
  isEmpty,
  isUndefined,
  keys,
  reduce,
  isNumber,
  isString,
  last,
  map,
  partial,
  sumBy,
  toString,
} from 'lodash';

import {inject, injectable, singleton} from 'tsyringe';

import {
  AbstractEventStreamListener,
  DomainEvent,
  EventStream,
  EventStreamEvent,
  getOrderSwapCancelInitSuccessEventOrThrow,
  getOrderSwapFillInitSuccessEventOrThrow,
  getOrderSwapOpenInitSuccessEventOrThrow,
  OrderSwapEvent,
} from '~/domain/events';

import {OrderSwapReducer} from '~/domain/events/reducer';
import {OrderSwapMutation} from '~/domain/events/mutation';

import * as Prisma from '@prisma/client';
import {Hex, Rational} from '~/domain/models/cardano';
import * as Oura from '~/domain/models/oura';
import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import * as Response from '~/domain/types/response';

import {TransactionalContext} from '~/domain/context';

import {
  AssetRepository,
  eventFilterOption,
  EventStreamRepository,
  OrderSwapRepository,
} from '~/domain/repositories';

import {
  ConfigService,
  CoreService,
  LoggerService,
  OrderSwapService,
  MarketOrderPriceService,
  OrderSwapScriptService,
} from '~/domain/services';

import {
  div,
  extractNumeratorDenominator,
  minNumeric,
  plus,
  times,
  toFixed,
} from '~/domain/utils/math.util';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';
import {ApplicationError} from './application.error';
import {ErrorCode, PublicError} from '~/domain/errors';

import {OrderSwapFeeService} from '~/domain/services/orderSwapFee.service';
import {
  isOnChainSuccessEvent,
  OnChainFailureErrorDetails,
  OrderSwapOnChainSuccessEvent,
} from '~/domain/events/orderSwap/shared/OrderSwapOnChainEvent';
import {OrderSwapExclusionCache} from '~/implementation/redis/repositories/orderSwapExclusionCache';
import {getUtxoRef} from '~/domain/models/private';
import Big from 'big.js';
import {randomInt} from 'crypto';
import {MarketOrderStrategy} from '~/domain/models/private/marketOrderStrategy';

@singleton()
@injectable()
export class OrderSwapApplication {
  constructor(
    @inject('CoreService')
    private readonly coreService: CoreService,

    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('OrderSwapService')
    private readonly orderSwapService: OrderSwapService,

    @inject('OrderSwapScriptService')
    private readonly orderSwapScriptService: OrderSwapScriptService,

    @inject('OrderSwapFeeService')
    private readonly orderSwapFeeService: OrderSwapFeeService,

    @inject('MarketOrderPriceService')
    private readonly marketOrderPriceService: MarketOrderPriceService,

    @inject('OrderSwapReducer')
    private readonly orderSwapReducer: OrderSwapReducer,

    @inject('OrderSwapMutation')
    private readonly orderSwapMutation: OrderSwapMutation,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('OrderSwapRepository')
    private readonly orderSwapRepository: OrderSwapRepository,

    @inject('EventStreamRepository')
    private readonly eventStreamRepository: EventStreamRepository<OrderSwapEvent>,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('OrderSwapExclusionCache')
    private readonly orderSwapExclusionCache: OrderSwapExclusionCache,

    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    @inject('DomainEventListenerProjections')
    private readonly domainEventListenerProjections: AbstractEventStreamListener
  ) {}

  async addOrderSwapsByUtxoRefToExclusionList(
    context: TransactionalContext,
    eventStream: EventStream<OrderSwapEvent>
  ) {
    const ttlSeconds =
      this.configService.getDexOrderSwapExclusionCacheTtlSeconds();

    const utxoRefs =
      this.orderSwapService.getUtxoRefsFromFillEventStream(eventStream);

    const orderSwaps = await this.orderSwapRepository.getOrderSwapsByUtxoRefs(
      context,
      utxoRefs
    );

    const missingOrderSwapRefs = this.findMissingOrderSwapsFromUtxoList(
      utxoRefs,
      orderSwaps
    );

    if (!isEmpty(missingOrderSwapRefs))
      this.loggerService.error(
        new ApplicationError(ErrorCode.ORDER__ORDER_NOT_FOUND),
        `ORDER SWAP FAILED TO FIND ORDERS FOR PROVIDED UTXO REFS: ${JSON.stringify(
          missingOrderSwapRefs
        )}`
      );

    this.orderSwapExclusionCache.excludeOrderSwaps(orderSwaps, ttlSeconds);
  }

  async getOrderSwapOpenFee(
    context: TransactionalContext,
    orderData: Public.SwapOrderData,
    walletAccount: Public.WalletAccount
  ): Promise<Public.SwapOrderMakerTotalFeesDeposit> {
    const transactionFees = await this.getOrderSwapOpenTransactionFees(
      context,
      walletAccount,
      orderData
    );

    // Calculate order total fees amount
    const orderSwapMakerTotalFeesAmount =
      this.orderSwapFeeService.calculateOrderSwapMakerTotalFeesAmount(
        transactionFees
      );

    return {
      ...transactionFees,
      transactionTotalFeesAmount: orderSwapMakerTotalFeesAmount,
    };
  }

  private async getOrderSwapOpenTransactionFees(
    context: TransactionalContext,
    walletAccount: Public.WalletAccount,
    orderData: Public.SwapOrderData
  ): Promise<Private.OrderSwapMakerFeesTransactionFeeAndDeposit> {
    const orderSwapOpenRequest = await this.toCoreOrderSwapOpenRequest(
      context,
      walletAccount,
      orderData
    );

    const {
      depositAmount,
      makerLovelaceFlatFeeAmount,
      makerFromAssetFeeAmount,
      makerFromAssetFeePercent,
      transactionFeeAmount,
    } = await this.coreService.orderSwapOpen(orderSwapOpenRequest);

    return {
      depositAmount,
      makerLovelaceFlatFeeAmount,
      makerFromAssetFeeAmount,
      makerFromAssetFeePercent,
      transactionFeeAmount,
    };
  }

  private findMissingOrderSwapsFromUtxoList(
    utxoRefs: Private.UtxoRef[],
    orderSwaps: Prisma.OrderSwap[]
  ) {
    const findOrderSwapByUtxoRef = (
      (orderSwaps: Prisma.OrderSwap[]) => (utxoRef: Private.UtxoRef) =>
        find(
          orderSwaps,
          (orderSwap: Prisma.OrderSwap) =>
            orderSwap.utxoReferenceTransactionHash ===
              utxoRef.utxoReferenceTransactionHash &&
            orderSwap.utxoReferenceIndex === utxoRef.utxoReferenceIndex
        )
    )(orderSwaps);

    const utxoRefOrderSwapMap = reduce(
      utxoRefs,
      (result, item) => ({
        ...result,
        [`${item.utxoReferenceTransactionHash}#${item.utxoReferenceIndex}`]:
          findOrderSwapByUtxoRef(item),
      }),
      {}
    );

    const missingOrderSwapRefs = map(
      filter(utxoRefOrderSwapMap, isUndefined),
      keys
    );

    return missingOrderSwapRefs;
  }

  private async toCoreOrderSwapOpenRequest(
    context: TransactionalContext,
    walletAccount: Public.WalletAccount,
    orderData: Public.SwapOrderData
  ): Promise<Core.OrderSwapOpenRequest> {
    const {
      collateralUtxo,

      walletAddress,
      walletRewardAddresses,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = walletAccount;

    const {toAssetId, toAssetName, toAssetPolicyId, toAssetAmount} =
      await this.getToAsset(context, orderData);

    const {fromAssetId, fromAssetName, fromAssetPolicyId, fromAssetAmount} =
      await this.getFromAsset(context, orderData);

    const {effectiveFromDate, effectiveUntilDate} = orderData;

    const orderVersion =
      this.orderSwapScriptService.getCurrentCoreOrderScriptVersion();

    const orderSwapOpenRequest: Core.OrderSwapOpenRequest = {
      collateralUtxo,

      walletAddress,
      walletRewardAddresses,
      walletUsedAddresses,
      walletUnusedAddresses,

      toAssetId,
      toAssetName,
      toAssetPolicyId,
      toAssetAmount,

      fromAssetId,
      fromAssetName,
      fromAssetPolicyId,
      fromAssetAmount,

      effectiveFromDate,
      effectiveUntilDate,

      orderVersion,
    };

    return orderSwapOpenRequest;
  }

  async getOrderSwapFillFee(
    context: TransactionalContext,
    walletAccount: Public.WalletAccount,
    fillSwapOrders: Public.FillSwapOrder[]
  ): Promise<Public.SwapOrderTakerTotalFees> {
    const transactionFees = await this.getOrderSwapFillTransactionFees(
      context,
      walletAccount,
      fillSwapOrders
    );

    const {takerFromAssetFeeAmount, takerFromAssetFeePercent} = transactionFees;

    // Calculate order total fees amount
    const orderSwapTakerTotalFeesAmount =
      this.orderSwapFeeService.calculateOrderSwapTakerTotalFeesAmount(
        transactionFees
      );

    return {
      ...transactionFees,
      takerFromAssetFeeAmount,
      takerFromAssetFeePercent,
      transactionTotalFeesAmount: orderSwapTakerTotalFeesAmount,
    };
  }

  private async getOrderSwapFillTransactionFees(
    context: TransactionalContext,
    walletAccount: Public.WalletAccount,
    fillSwapOrders: Public.FillSwapOrder[]
  ): Promise<Private.OrderSwapTakerFees & Private.TransactionFee> {
    const OrderSwapMultiFillData = await this.processOrderSwapMultiFillData(
      context,
      fillSwapOrders
    );

    const utxoRefsWithAmt: Core.UtxoRefsWithAmt = map(
      OrderSwapMultiFillData,
      filledOrderData => ({
        utxoReference: filledOrderData.utxoReference,
        toAssetAmount: filledOrderData.fillToAssetAmount,
      })
    );

    const orderSwapFillRequest: Core.OrderSwapMultiFillRequest = {
      ...walletAccount,
      utxoRefsWithAmt,
    };

    const orderSwapFillResponse: Private.UnsignedTransactionSwapOrderFill =
      await this.coreService.orderSwapMultiFill(orderSwapFillRequest);

    const {
      takerLovelaceFlatFeeAmount,
      takerFromAssetFeeAmount,
      takerFromAssetFeePercent,
      transactionFeeAmount,
    } = orderSwapFillResponse;

    return {
      takerLovelaceFlatFeeAmount,
      takerFromAssetFeeAmount,
      takerFromAssetFeePercent,
      transactionFeeAmount,
    };
  }

  async createOrderSwapOpenInit(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    orderSwapData: Public.SwapOrderData
  ): Promise<Public.UnsignedTransaction | Error> {
    const orderSwapEventStream = await this.createOrderSwapOpenRequest(
      context,
      user,
      orderSwapData
    );

    const orderSwapOpenInitUnsignedTransaction = await this.orderSwapOpenInit(
      context,
      user,
      walletAccount,
      orderSwapData,
      orderSwapEventStream
    );

    return await this.handleOpenInitErrorGracefullyAndReturn(
      context,
      user,
      orderSwapEventStream,
      orderSwapOpenInitUnsignedTransaction
    );
  }

  private async handleOpenInitErrorGracefullyAndReturn(
    context: TransactionalContext,
    user: Private.User,
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    orderSwapOpenInitUnsignedTransaction: Response.Response<Public.UnsignedTransaction>
  ): Promise<Public.UnsignedTransaction | Error> {
    const orderSwapOpenInitUnsignedTransactionOrError = await Response.fold<
      Error,
      Public.UnsignedTransaction,
      Promise<Response.Response<Public.UnsignedTransaction>>
    >(
      async orderSwapOpenInitError => {
        const handledError = await this.handleCreateOrderSwapOpenError(
          context,
          user,
          orderSwapEventStream,
          orderSwapOpenInitError
        );

        return Promise.resolve(Response.fromError(handledError));
      },
      async unsignedTransaction => {
        return Promise.resolve(Response.fromResult(unsignedTransaction));
      }
    )(orderSwapOpenInitUnsignedTransaction);

    return Response.unwrap(orderSwapOpenInitUnsignedTransactionOrError);
  }

  private async handleCreateOrderSwapOpenError(
    context: TransactionalContext,
    user: Private.User,
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    orderSwapOpenInitError: Error
  ): Promise<Error> {
    const {userId} = user;

    const {message: errorReason} = orderSwapOpenInitError;
    const errorCode = ErrorCode.UNKNOWN_ERROR;

    const errorCodeReason: Private.ErrorCodeReason = {
      errorCode,
      errorReason,
    };

    const orderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapOpenInitFailure(
        orderSwapEventStream,
        userId,
        errorCodeReason
      );

    await this.eventStreamRepository.saveEventStream(
      context,
      orderSwapEventStreamMutated
    );

    return orderSwapOpenInitError;
  }

  private async orderSwapOpenInit(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    orderSwapData: Public.SwapOrderData,
    orderSwapEventStream: EventStream<OrderSwapEvent>
  ): Promise<Response.Response<Public.UnsignedTransaction>> {
    try {
      const unsignedTransaction = await this.orderSwapOpenInitOrThrow(
        context,
        user,
        walletAccount,
        orderSwapData,
        orderSwapEventStream
      );

      return Response.fromResult(unsignedTransaction);
    } catch (e) {
      if (e instanceof Error) {
        return Response.fromError(e);
      } else {
        throw e;
      }
    }
  }

  private async orderSwapOpenInitOrThrow(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    orderSwapData: Public.SwapOrderData,
    orderSwapEventStream: EventStream<OrderSwapEvent>
  ): Promise<Public.UnsignedTransaction> {
    const orderSwapOpenRequest = await this.toCoreOrderSwapOpenRequest(
      context,
      walletAccount,
      orderSwapData
    );

    const orderSwapOpenInitTransaction = await this.coreService.orderSwapOpen(
      orderSwapOpenRequest
    );

    const {transactionHash, transactionPayload, transactionMint} =
      orderSwapOpenInitTransaction;

    const [firstMintAsset] = transactionMint;
    const {mintAssetId} = firstMintAsset;

    const {
      depositAmount,
      makerLovelaceFlatFeeAmount,
      makerFromAssetFeeAmount,
      makerFromAssetFeePercent,
      transactionFeeAmount,
    } = orderSwapOpenInitTransaction;

    const orderSwapFeesAndDepositAmount: Private.OrderSwapMakerFeesTransactionFeeAndDeposit =
      {
        depositAmount,
        makerLovelaceFlatFeeAmount,
        makerFromAssetFeeAmount,
        makerFromAssetFeePercent,
        transactionFeeAmount,
      };

    const {eventStreamEvent: orderSwapInitSuccessEvent} =
      await this.orderSwapOpenInitSuccess(
        context,
        user,
        transactionHash,
        mintAssetId,
        orderSwapEventStream,
        orderSwapFeesAndDepositAmount
      );

    const {eventId: orderSwapOpenInitSuccessEventId} =
      orderSwapInitSuccessEvent;

    return {
      transactionPayload,
      transactionId: orderSwapOpenInitSuccessEventId.toString(),
    };
  }

  private async createOrderSwapOpenRequest(
    context: TransactionalContext,
    user: Private.User,
    orderData: Public.SwapOrderData
  ): Promise<EventStream<OrderSwapEvent>> {
    const {userId} = user;

    const orderSwapEventStream = this.eventStreamRepository.newEventStream();

    const orderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapOpenInitRequest(
        orderSwapEventStream,
        userId,
        orderData
      );

    const savedEventStream = await this.eventStreamRepository.saveEventStream(
      context,
      orderSwapEventStreamMutated
    );

    return savedEventStream;
  }

  private async orderSwapOpenInitSuccess(
    context: TransactionalContext,
    user: Private.User,
    transactionHash: Hex,
    mintAssetId: string,
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    orderSwapFeeAndDepositAmount: Private.OrderSwapMakerFeesTransactionFeeAndDeposit
  ): Promise<EventStreamEvent> {
    const {userId} = user;

    const orderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapOpenInitSuccess(
        userId,
        transactionHash,
        mintAssetId,
        orderSwapEventStream,
        orderSwapFeeAndDepositAmount
      );

    const savedEventStream = await this.eventStreamRepository.saveEventStream(
      context,
      orderSwapEventStreamMutated
    );

    const {streamEvents} = savedEventStream;

    const orderSwapOpenInitSuccessEvent =
      getOrderSwapOpenInitSuccessEventOrThrow(streamEvents);

    return {
      eventStream: savedEventStream,
      eventStreamEvent: orderSwapOpenInitSuccessEvent,
    };
  }

  /**
   * Initiate direct fill
   */
  async createOrderSwapFillInit(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    fillOrderType: Public.SwapOrderFillType,
    fillSwapOrders: Public.FillSwapOrder[]
  ): Promise<Public.UnsignedTransaction | Error> {
    const fillOrderSwapEventStream = await this.createOrderSwapFillInitRequest(
      context,
      user,
      fillOrderType,
      fillSwapOrders
    );

    const orderSwapFillInitUnsignedTransactionOrError =
      await this.orderSwapFillInit(
        context,
        user,
        walletAccount,
        fillSwapOrders,
        fillOrderSwapEventStream
      );

    return await this.handleFillInitErrorGracefullyAndReturn(
      context,
      user,
      fillOrderSwapEventStream,
      orderSwapFillInitUnsignedTransactionOrError
    );
  }

  async orderSwapFillInit(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    fillSwapOrders: Public.FillSwapOrder[],
    fillOrderSwapEventStream: EventStream<OrderSwapEvent>
  ): Promise<Response.Response<Public.UnsignedTransaction>> {
    try {
      const unsignedTransaction = await this.orderSwapFillInitOrThrow(
        context,
        user,
        walletAccount,
        fillSwapOrders,
        fillOrderSwapEventStream
      );

      return Response.fromResult(unsignedTransaction);
    } catch (e) {
      if (e instanceof Error) {
        return Response.fromError(e);
      } else {
        throw e;
      }
    }
  }

  private async createOrderSwapFillInitRequest(
    context: TransactionalContext,
    user: Private.User,
    fillOrderType: Public.SwapOrderFillType,
    fillSwapOrders: Public.FillSwapOrder[]
  ): Promise<EventStream<OrderSwapEvent>> {
    const {userId} = user;

    const orderSwapReferencesWithAmounts = fillSwapOrders.map(
      fillSwapOrder => ({
        orderReference: fillSwapOrder.orderReference,
        toAssetAmount: fillSwapOrder.toAssetAmount,
      })
    );

    const totalToAssetAmount = plus(
      0,
      ...fillSwapOrders.map(order => order.toAssetAmount)
    ).toString();

    const orderSwapEventStream = this.eventStreamRepository.newEventStream();

    if (isEmpty(fillSwapOrders)) {
      throw new ApplicationError(ErrorCode.ORDER__NOT_FOUND);
    }

    const orderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapFillInitRequest(orderSwapEventStream, {
        userId,
        orderType: fillOrderType,
        orderSwapReferencesWithAmounts,
        toAssetAmount: totalToAssetAmount,
      });

    const savedEventStream = await this.eventStreamRepository.saveEventStream(
      context,
      orderSwapEventStreamMutated
    );

    return savedEventStream;
  }

  async orderSwapFillInitOrThrow(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    fillSwapOrders: Public.FillSwapOrder[],
    fillOrderSwapEventStream: EventStream<OrderSwapEvent>
  ): Promise<Public.UnsignedTransaction> {
    const {userId} = user;

    const orderSwapMultiFillData = await this.processOrderSwapMultiFillData(
      context,
      fillSwapOrders
    );

    const utxoRefsWithAmt: Core.UtxoRefsWithAmt = map(
      orderSwapMultiFillData,
      filledOrderData => ({
        utxoReference: filledOrderData.utxoReference,
        toAssetAmount: filledOrderData.fillToAssetAmount,
      })
    );

    const orderSwapFillUnsignedTransaction =
      await this.coreService.orderSwapMultiFill({
        ...walletAccount,
        utxoRefsWithAmt,
      });

    const {
      transactionHash,
      transactionPayload,
      takerLovelaceFlatFeeAmount,
      takerFromAssetFeeAmount,
      takerFromAssetFeePercent,
      transactionFeeAmount,
    } = orderSwapFillUnsignedTransaction;

    const totalToAssetAmount = plus(
      0,
      ...orderSwapMultiFillData.map(
        filledOrderData => filledOrderData.fillToAssetAmount
      )
    ).toString();

    const totalFromAssetAmount = plus(
      0,
      ...orderSwapMultiFillData.map(
        filledOrderData => filledOrderData.fillFromAssetAmount
      )
    ).toString();

    const price = div(Number(totalFromAssetAmount), Number(totalToAssetAmount));

    const {numerator: priceNumerator, denominator: priceDenominator} =
      extractNumeratorDenominator(price);

    const {
      toAssetId: filledOrderSwapToAssetId,
      fromAssetId: filledOrderSwapFromAssetId,
    } = orderSwapMultiFillData[0].filledOrderSwap;

    const filledOrderSwapUnspentOutputReferenceWithAmounts =
      await this.extractFilledOrderSwapUnspentOutputsWithToAssetAmounts(
        context,
        orderSwapMultiFillData
      );

    const fillOrderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapFillInitSuccess(
        fillOrderSwapEventStream,
        transactionHash,
        {
          userId,
          // Assets are swapped as they are sourced from the order being filled (open order)
          toAssetId: filledOrderSwapFromAssetId,
          fromAssetId: filledOrderSwapToAssetId,
          // Amounts are not swapped as they are sourced from the request data
          // which is representative of the consuming order (fill order)
          toAssetAmount: totalToAssetAmount,
          fromAssetAmount: totalFromAssetAmount,
          filledOrderSwapUnspentOutputReferenceWithAmounts,
          takerLovelaceFlatFeeAmount,
          transactionFeeAmount,
          takerFromAssetFeeAmount,
          takerFromAssetFeePercent,
          price,
          priceNumerator: priceNumerator ?? null,
          priceDenominator: priceDenominator ?? null,
        }
      );

    const savedFillOrderSwapEventStream =
      await this.eventStreamRepository.saveEventStream(
        context,
        fillOrderSwapEventStreamMutated
      );

    const {streamEvents: fillOrderSwapEventStreamEvents} =
      savedFillOrderSwapEventStream;

    const fillOrderSwapFillInitEvent = getOrderSwapFillInitSuccessEventOrThrow(
      fillOrderSwapEventStreamEvents
    );

    const {eventId: fillOrderSwapFillInitEventId} = fillOrderSwapFillInitEvent;

    return {
      transactionPayload,
      transactionId: fillOrderSwapFillInitEventId,
    };
  }

  private async processOrderSwapMultiFillData(
    context: TransactionalContext,
    fillSwapOrders: Public.FillSwapOrder[]
  ): Promise<Private.OrderSwapMultiFillData[]> {
    const OrderSwapMultiFillData = await Promise.all(
      fillSwapOrders.map(async fillSwapOrder => {
        const filledOrderSwap =
          await this.orderSwapRepository.getOrderSwapByOrderIdOrThrow(
            context,
            fillSwapOrder.orderReference.orderId
          );

        const utxoReference = getUtxoRef(filledOrderSwap);

        // Use the toAssetAmount from the fillSwapOrder directly
        const fillToAssetAmount = fillSwapOrder.toAssetAmount;

        // Calculate the fillFromAssetAmount determined on the price and fillToAssetAmount
        const fillFromAssetAmount = flow(
          partial(div, 1),
          partial(times, fillToAssetAmount),
          toFixed,
          toString
        )(filledOrderSwap.price);

        return {
          utxoReference,
          fillToAssetAmount,
          fillFromAssetAmount,
          filledOrderSwap,
        };
      })
    );

    return OrderSwapMultiFillData;
  }

  private async extractFilledOrderSwapUnspentOutputsWithToAssetAmounts(
    context: TransactionalContext,
    orderSwapMultiFillData: Private.OrderSwapMultiFillData[]
  ): Promise<Private.FilledOrderSwapUnspentOutputReferenceWithAmount[]> {
    const filledOrderSwapUnspentOutputReferenceWithAmounts =
      orderSwapMultiFillData.map(({filledOrderSwap, fillToAssetAmount}) => {
        const {
          utxoReferenceIndex: filledOrderSwapUtxoReferenceIndex,
          utxoReferenceTransactionHash:
            filledOrderSwapUtxoReferenceTransactionHash,
        } = filledOrderSwap;

        if (
          !isNumber(filledOrderSwapUtxoReferenceIndex) ||
          !isString(filledOrderSwapUtxoReferenceTransactionHash)
        ) {
          throw new ApplicationError(
            ErrorCode.INVALID_ORDER__TRANSACTION_REFERENCE_NOT_FOUND
          );
        }

        const orderSwapUnspentOutputReference: Private.FilledOrderSwapUnspentOutputReference =
          {
            filledOrderSwapUtxoReferenceIndex,
            filledOrderSwapUtxoReferenceTransactionHash,
          };
        return {
          filledOrderSwapUnspentOutputReference:
            orderSwapUnspentOutputReference,
          filledOrderSwapToAssetFillAmount: fillToAssetAmount,
        };
      });

    return filledOrderSwapUnspentOutputReferenceWithAmounts;
  }

  private async handleFillInitErrorGracefullyAndReturn(
    context: TransactionalContext,
    user: Private.User,
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    orderSwapFillInitUnsignedTransaction: Response.Response<Public.UnsignedTransaction>
  ): Promise<Public.UnsignedTransaction | Error> {
    const orderSwapFillInitUnsignedTransactionOrError = await Response.fold<
      Error,
      Public.UnsignedTransaction,
      Promise<Response.Response<Public.UnsignedTransaction>>
    >(
      async orderSwapFillInitError => {
        const handledError = await this.handleCreateOrderSwapFillError(
          context,
          user,
          orderSwapEventStream,
          orderSwapFillInitError
        );

        return Promise.resolve(Response.fromError(handledError));
      },
      async unsignedTransaction => {
        return Promise.resolve(Response.fromResult(unsignedTransaction));
      }
    )(orderSwapFillInitUnsignedTransaction);

    return Response.unwrap(orderSwapFillInitUnsignedTransactionOrError);
  }

  private async handleCreateOrderSwapFillError(
    context: TransactionalContext,
    user: Private.User,
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    orderSwapOpenInitError: Error
  ): Promise<Error> {
    const {userId} = user;

    const {message: errorReason} = orderSwapOpenInitError;
    const errorCode = ErrorCode.UNKNOWN_ERROR;

    const errorCodeReason: Private.ErrorCodeReason = {
      errorCode,
      errorReason,
    };

    const orderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapFillInitFailure(
        orderSwapEventStream,
        userId,
        errorCodeReason
      );

    await this.eventStreamRepository.saveEventStream(
      context,
      orderSwapEventStreamMutated
    );

    return orderSwapOpenInitError;
  }

  async createOrUpdateOrderSwapDirectFill(
    context: TransactionalContext,
    event: Oura.Event,
    userId: string,
    orderSwapId: string,
    transactionHash: Hex,
    toAssetId: string,
    fromAssetId: string,
    toAssetAmount: string,
    fromAssetAmount: string,
    price: number,
    priceNumerator: string | null,
    priceDenominator: string | null
  ): Promise<void> {
    const {
      context: {
        timestamp: transactionTimestamp,
        block_hash: blockHash,
        slot: blockSlot,
      },
    } = event;

    const orderSwapEventStream =
      await this.eventStreamRepository.getEventStreamByStreamId(
        context,
        orderSwapId,
        eventFilterOption.ORDER_SWAP
      );

    const orderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapFillOnChain(
        orderSwapEventStream,
        {
          userId,
          toAssetId,
          fromAssetId,
          toAssetAmount,
          fromAssetAmount,
          transactionTimestamp,
          // Price inverted to match consuming fill upstream
          price,
          priceNumerator,
          priceDenominator,
        },
        transactionHash,
        blockHash,
        BigInt(blockSlot)
      );

    await this.eventStreamRepository.saveEventStream(
      context,
      orderSwapEventStreamMutated
    );
  }

  async createOrUpdateOrderSwapOpenOnChain(
    context: TransactionalContext,
    event: Oura.TransactionEvent,
    userId: string | null,
    mintAssetId: string,
    toAssetId: string,
    toAssetAmountTotalRemaining: bigint,
    fromAssetId: string,
    fromAssetAmountTotalRemaining: bigint,
    utxoReferenceTransactionHash: string,
    utxoReferenceIndex: number,
    partialFillCount: number,
    effectiveFromDate: Date | null,
    effectiveUntilDate: Date | null,
    price: number,
    priceRatio: Rational,
    makerLovelaceFlatFeeAmount: number,
    makerFromAssetFeeAmount: number,
    takerLovelaceFlatFeeAmount: number
  ) {
    const {
      context: {
        timestamp: transactionTimestamp,
        block_hash: blockHash,
        slot: blockSlot,
      },
      transaction: {hash: transactionHash, fee: transactionFeeAmount},
    } = event;

    const orderSwapEventStream = await this.getOrCreateEventStreamByMintAssetId(
      context,
      mintAssetId
    );

    const {numerator, denominator} = priceRatio;

    const makerFromAssetFeePercent = times(
      div(makerFromAssetFeeAmount, fromAssetAmountTotalRemaining.toString()),
      100
    );

    const orderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapOpenOnChain(
        orderSwapEventStream,
        {
          userId,
          mintAssetId,
          orderType: Private.orderSwapOrderTypes.LIMIT,
          toAssetId,
          fromAssetId,
          toAssetAmount: toAssetAmountTotalRemaining.toString(),
          fromAssetAmount: fromAssetAmountTotalRemaining.toString(),
          toAssetAmountTotalRemaining: toAssetAmountTotalRemaining.toString(),
          fromAssetAmountTotalRemaining:
            fromAssetAmountTotalRemaining.toString(),
          toAssetAmountTotalFilled: '0',
          fromAssetAmountTotalFilled: '0',
          utxoReferenceTransactionHash,
          utxoReferenceIndex,
          transactionFeeAmount: transactionFeeAmount.toString(),
          partialFillCount,
          effectiveFromDate,
          effectiveUntilDate,
          transactionTimestamp,
          price,
          priceNumerator: numerator.toString(),
          priceDenominator: denominator.toString(),
          makerLovelaceFlatFeeAmount: makerLovelaceFlatFeeAmount.toString(),
          makerFromAssetFeeAmount: makerFromAssetFeeAmount.toString(),
          makerFromAssetFeePercent: makerFromAssetFeePercent.toString(),
          takerLovelaceFlatFeeAmount: takerLovelaceFlatFeeAmount.toString(),
        },
        transactionHash,
        blockHash,
        BigInt(blockSlot)
      );

    await this.eventStreamRepository.saveEventStream(
      context,
      orderSwapEventStreamMutated
    );
  }

  async createOrUpdateOrderSwapPartialFill(
    context: TransactionalContext,
    event: Oura.TransactionEvent,
    userId: string | null,
    mintAssetId: string,
    toAssetId: string,
    toAssetAmountTotalRemaining: bigint,
    fromAssetId: string,
    fromAssetAmountTotalRemaining: bigint,
    utxoReferenceTransactionHash: string,
    utxoReferenceIndex: number,
    partialFillCount: number,
    effectiveFromDate: Date | null,
    effectiveUntilDate: Date | null,
    price: number,
    priceRatio: Rational
  ): Promise<void> {
    const {
      context: {
        timestamp: transactionTimestamp,
        block_hash: blockHash,
        slot: blockSlot,
      },
      transaction: {hash: transactionHash, fee: transactionFeeAmount},
    } = event;

    const orderEventStream = await this.getEventStreamByMintAssetId(
      context,
      mintAssetId
    );

    if (orderEventStream) {
      const orderSwap = this.orderSwapReducer.reduce(orderEventStream);

      const {toAssetAmount, fromAssetAmount} = orderSwap;

      const toAssetAmountTotalFilled =
        BigInt(toAssetAmount) - toAssetAmountTotalRemaining;

      const fromAssetAmountTotalFilled =
        BigInt(fromAssetAmount) - fromAssetAmountTotalRemaining;

      const {numerator, denominator} = priceRatio;

      const orderSwapEventStreamMutated =
        this.orderSwapMutation.orderSwapPartialFillOnChain(
          orderEventStream,
          {
            userId,
            mintAssetId,
            orderType: Private.orderSwapOrderTypes.LIMIT,
            toAssetId: toAssetId,
            fromAssetId: fromAssetId,
            toAssetAmountTotalRemaining: toAssetAmountTotalRemaining.toString(),
            fromAssetAmountTotalRemaining:
              fromAssetAmountTotalRemaining.toString(),
            toAssetAmountTotalFilled: toAssetAmountTotalFilled.toString(),
            fromAssetAmountTotalFilled: fromAssetAmountTotalFilled.toString(),
            utxoReferenceTransactionHash,
            utxoReferenceIndex,
            transactionFeeAmount: transactionFeeAmount.toString(),
            partialFillCount,
            effectiveFromDate,
            effectiveUntilDate,
            transactionTimestamp,
            price,
            priceNumerator: numerator.toString(),
            priceDenominator: denominator.toString(),
          },
          transactionHash,
          blockHash,
          BigInt(blockSlot)
        );

      await this.eventStreamRepository.saveEventStream(
        context,
        orderSwapEventStreamMutated
      );
    } else {
      // Expected in the case that pre-existing orders which are partially filled would not be found.
      // New order will be available from partial fill.
      // These orphaned partial fills should be investigated to determine cause.
      this.loggerService.error(
        new ApplicationError(
          ErrorCode.ONCHAIN_EVENT__CRITICAL_FAILED_TO_FIND_ORDER
        ),
        `ORDER SWAP PARTIAL FILL MISSING ORDER: mintAssetId <${mintAssetId}>, utxoRef <${utxoReferenceTransactionHash}#${utxoReferenceIndex}>`
      );
    }
  }

  async createOrUpdateOrderSwapFinalFill(
    context: TransactionalContext,
    event: Oura.TransactionEvent,
    orderSwap: Private.OnchainLimitOrderSwap
  ): Promise<void> {
    const {
      context: {
        timestamp: transactionTimestamp,
        block_hash: blockHash,
        slot: blockSlot,
      },
      transaction: {hash: transactionHash, fee: transactionFeeAmount},
    } = event;

    const {
      userId,
      mintAssetId,
      toAssetId,
      fromAssetId,
      toAssetAmount,
      fromAssetAmount,
      partialFillCount,
      price,
      priceNumerator,
      priceDenominator,
    } = orderSwap;

    const orderEventStream = await this.getEventStreamByMintAssetId(
      context,
      mintAssetId
    );

    if (orderEventStream) {
      const orderSwapEventStreamMutated =
        this.orderSwapMutation.orderSwapFinalFillOnChain(
          orderEventStream,
          {
            userId,
            mintAssetId,
            orderType: Private.orderSwapOrderTypes.LIMIT,
            toAssetId,
            fromAssetId,
            toAssetAmountTotalRemaining: '0',
            fromAssetAmountTotalRemaining: '0',
            toAssetAmountTotalFilled: toAssetAmount.toString(),
            fromAssetAmountTotalFilled: fromAssetAmount.toString(),
            price,
            priceNumerator: priceNumerator?.toString() ?? null,
            priceDenominator: priceDenominator?.toString() ?? null,
            transactionFeeAmount: transactionFeeAmount.toString(),
            partialFillCount,
            transactionTimestamp,
          },
          transactionHash,
          blockHash,
          BigInt(blockSlot)
        );

      await this.eventStreamRepository.saveEventStream(
        context,
        orderSwapEventStreamMutated
      );
    } else {
      this.loggerService.error(
        new ApplicationError(
          ErrorCode.ONCHAIN_EVENT__CRITICAL_FAILED_TO_FIND_ORDER
        ),
        `ORDER SWAP FINAL FILL MISSING ORDER STREAM: mintAssetId <${mintAssetId}>, transactionHash <${transactionHash}>`
      );
    }
  }

  async updateOrderSwapCancel(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    orderReference: Public.OrderReference
  ): Promise<Public.UnsignedTransaction | Error> {
    const orderSwapCancelEventStream =
      await this.createOrderSwapCancelInitRequest(
        context,
        user,
        orderReference
      );

    const orderSwapCancelInitUnsignedTransactionOrError =
      await this.orderSwapCancelInit(
        context,
        user,
        walletAccount,
        orderSwapCancelEventStream
      );

    return await this.handleCancelInitErrorGracefullyAndReturn(
      context,
      user,
      orderSwapCancelEventStream,
      orderSwapCancelInitUnsignedTransactionOrError
    );
  }

  private async createOrderSwapCancelInitRequest(
    context: TransactionalContext,
    user: Private.User,
    canceledOrderReference: Public.OrderReference
  ): Promise<EventStream<OrderSwapEvent>> {
    const {orderId: orderSwapId} = canceledOrderReference;

    const orderSwapEventStream =
      await this.eventStreamRepository.getEventStreamByStreamId(
        context,
        orderSwapId,
        eventFilterOption.ORDER_SWAP
      );

    const {userId} = user;

    const orderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapCancelInitRequest(orderSwapEventStream, {
        userId,
        orderSwapId,
      });

    const savedCancelOrderSwapEventStream =
      await this.eventStreamRepository.saveEventStream(
        context,
        orderSwapEventStreamMutated
      );

    return savedCancelOrderSwapEventStream;
  }

  async orderSwapCancelInit(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    orderSwapEventStream: EventStream<OrderSwapEvent>
  ): Promise<Response.Response<Public.UnsignedTransaction>> {
    try {
      const unsignedTransaction = await this.orderSwapCancelInitOrThrow(
        context,
        user,
        walletAccount,
        orderSwapEventStream
      );

      return Response.fromResult(unsignedTransaction);
    } catch (e) {
      if (e instanceof Error) {
        return Response.fromError(e);
      } else {
        throw e;
      }
    }
  }

  private async orderSwapCancelInitOrThrow(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    orderSwapEventStream: EventStream<OrderSwapEvent>
  ): Promise<Public.UnsignedTransaction> {
    const {userId} = user;

    const {
      collateralUtxo,

      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = walletAccount;

    const cancelledOrderSwap =
      this.orderSwapReducer.reduce(orderSwapEventStream);

    const orderSwapUnspentOutputReference = getUtxoRef(cancelledOrderSwap);

    const {utxoReferenceTransactionHash, utxoReferenceIndex} =
      cancelledOrderSwap;

    const orderSwapCancelRequest: Core.OrderSwapCancelRequest = {
      collateralUtxo,

      walletAddress,
      walletUsedAddresses,
      walletUnusedAddresses,

      utxoReference: orderSwapUnspentOutputReference,
    };

    const unsignedCancelTransaction = await this.coreService.orderSwapCancel(
      orderSwapCancelRequest
    );

    const {transactionPayload, transactionHash} = unsignedCancelTransaction;

    if (
      (utxoReferenceIndex || utxoReferenceIndex === 0) && // Explicitly check for falsy zero
      utxoReferenceTransactionHash
    ) {
      const orderSwapEventStreamMutated =
        this.orderSwapMutation.orderSwapCancelInit(
          orderSwapEventStream,
          transactionHash,
          cancelledOrderSwap,
          {
            orderSwapId: cancelledOrderSwap.orderSwapId,
            userId,
            utxoReferenceTransactionHash,
            utxoReferenceIndex,
          }
        );

      const savedCancelOrderSwapEventStream =
        await this.eventStreamRepository.saveEventStream(
          context,
          orderSwapEventStreamMutated
        );

      const {streamEvents: cancelOrderSwapEventStreamEvents} =
        savedCancelOrderSwapEventStream;

      const cancelOrderSwapCancelInitEvent =
        getOrderSwapCancelInitSuccessEventOrThrow(
          cancelOrderSwapEventStreamEvents
        );

      const {eventId: cancelOrderSwapCancelInitEventId} =
        cancelOrderSwapCancelInitEvent;

      return {
        transactionPayload,
        transactionId: cancelOrderSwapCancelInitEventId.toString(),
      };
    } else {
      throw new ApplicationError(
        ErrorCode.INVALID_ORDER__TRANSACTION_REFERENCE_NOT_FOUND
      );
    }
  }

  private async handleCancelInitErrorGracefullyAndReturn(
    context: TransactionalContext,
    user: Private.User,
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    orderSwapCancelInitUnsignedTransaction: Response.Response<Public.UnsignedTransaction>
  ): Promise<Public.UnsignedTransaction | Error> {
    const orderSwapCancelInitUnsignedTransactionOrError = await Response.fold<
      Error,
      Public.UnsignedTransaction,
      Promise<Response.Response<Public.UnsignedTransaction>>
    >(
      async orderSwapFillInitError => {
        const handledError = await this.handleCreateOrderSwapCancelError(
          context,
          user,
          orderSwapEventStream,
          orderSwapFillInitError
        );

        return Promise.resolve(Response.fromError(handledError));
      },
      async unsignedTransaction => {
        return Promise.resolve(Response.fromResult(unsignedTransaction));
      }
    )(orderSwapCancelInitUnsignedTransaction);

    return Response.unwrap(orderSwapCancelInitUnsignedTransactionOrError);
  }

  private async handleCreateOrderSwapCancelError(
    context: TransactionalContext,
    user: Private.User,
    orderSwapEventStream: EventStream<OrderSwapEvent>,
    orderSwapOpenInitError: Error
  ): Promise<Error> {
    const {userId} = user;

    const {message: errorReason} = orderSwapOpenInitError;
    const errorCode = ErrorCode.UNKNOWN_ERROR;

    const errorCodeReason: Private.ErrorCodeReason = {
      errorCode,
      errorReason,
    };

    const orderSwapEventStreamMutated =
      this.orderSwapMutation.orderSwapCancelInitFailure(
        orderSwapEventStream,
        userId,
        errorCodeReason
      );

    await this.eventStreamRepository.saveEventStream(
      context,
      orderSwapEventStreamMutated
    );

    return orderSwapOpenInitError;
  }

  async createOrUpdateOrderSwapCancellation(
    context: TransactionalContext,
    event: Oura.TransactionEvent,
    orderSwap: Private.OnchainLimitOrderSwap
  ): Promise<void> {
    const {
      context: {
        timestamp: transactionTimestamp,
        block_hash: blockHash,
        slot: blockSlot,
      },
      transaction: {hash: transactionHash, fee: transactionFeeAmount},
    } = event;

    const {mintAssetId, userId, orderSwapId} = orderSwap;

    const orderEventStream = await this.getEventStreamByMintAssetId(
      context,
      mintAssetId
    );

    if (orderEventStream) {
      const orderSwapEventStreamMutated =
        this.orderSwapMutation.orderSwapCancelOnChain(
          orderEventStream,
          {
            userId,
            orderSwapId,
            transactionTimestamp,
            transactionFeeAmount: transactionFeeAmount.toString(),
          },
          transactionHash,
          blockHash,
          BigInt(blockSlot)
        );

      await this.eventStreamRepository.saveEventStream(
        context,
        orderSwapEventStreamMutated
      );
    } else {
      this.loggerService.error(
        new ApplicationError(
          ErrorCode.ONCHAIN_EVENT__CRITICAL_FAILED_TO_FIND_ORDER
        ),
        `ORDER SWAP CANCELLATION MISSING ORDER STREAM: mintAssetId <${mintAssetId}>, transactionHash <${transactionHash}>`
      );
    }
  }

  async updateEventStreamsAffectedByRollBack(
    context: TransactionalContext,
    rollbackDetails: Omit<
      OnChainFailureErrorDetails,
      'invalidatedEventId' | 'invalidatedTransactionHash'
    >
  ): Promise<void> {
    const eventsInInvalidatedBlocks: DomainEvent[] =
      await this.eventStreamRepository.getEventsWhereBlockSlotGreaterThan(
        context,
        rollbackDetails.rollBackBlock.blockSlot
      );

    const eventsToInvalidate: OrderSwapOnChainSuccessEvent[] = filter(
      eventsInInvalidatedBlocks,
      isOnChainSuccessEvent
    );

    const groupedEventsToInvalidate: Dictionary<
      OrderSwapOnChainSuccessEvent[]
    > = groupBy(eventsToInvalidate, event => event.streamId);

    await Promise.all(
      map(
        groupedEventsToInvalidate,
        async (streamEventsToInvalidate, streamId) => {
          const eventStream =
            await this.eventStreamRepository.getEventStreamByStreamId(
              context,
              streamId,
              eventFilterOption.ORDER_SWAP
            );

          const mutatedEventStream: EventStream<OrderSwapEvent> =
            this.orderSwapService.appendEventStreamWithOnChainFailureEvents(
              eventStream,
              streamEventsToInvalidate,
              rollbackDetails
            );

          await this.eventStreamRepository.saveEventStream(
            context,
            mutatedEventStream
          );
        }
      )
    );
  }

  async listOrderSwaps(
    context: TransactionalContext,
    query: Private.OrderSwapQuery,
    userWalletStakeKeyHash?: string
  ): Promise<Private.PaginatedResults<Public.SwapOrder>> {
    const listOrderCountLimit = this.configService.getEntityRetreivalLimit();

    const filterByOwnerWalletStakeKeyHash = query.filterByOwner
      ? userWalletStakeKeyHash
      : null;

    const walletStakeKeyHash =
      query.filterByWalletStakeKeyHash ||
      filterByOwnerWalletStakeKeyHash ||
      null;

    const {
      results: orderSwaps,
      count,
      next,
      prev,
    } = await this.orderSwapRepository.listOrderSwaps(
      context,
      query,
      listOrderCountLimit,
      walletStakeKeyHash
    );

    const orderSwapsWithEventStream = await Promise.all(
      map(orderSwaps, async orderSwap => {
        const {orderSwapId} = orderSwap;
        const {streamEvents} =
          await this.eventStreamRepository.getEventStreamByStreamId(
            context,
            orderSwapId,
            eventFilterOption.ORDER_SWAP
          );

        return {orderSwap, streamEvents};
      })
    );

    const orderSwapAssetsIds = Private.getOrdersSwapAssetIds(orderSwaps);

    const orderSwapAssetsMap =
      await this.assetRepository.getAssetsMapByAssetIds(
        context,
        orderSwapAssetsIds
      );

    const publicOrderSwaps: Public.SwapOrder[] = map(
      orderSwapsWithEventStream,
      orderSwapWithEventStream =>
        this.domainMapper.toPublicOrderSwaps(
          orderSwapAssetsMap,
          orderSwapWithEventStream
        )
    );

    const listOrderSwaps = {
      count,
      next,
      previous: prev,
      results: publicOrderSwaps,
    };

    return listOrderSwaps;
  }

  async getOrderSwapBestAvailable(
    context: TransactionalContext,
    query: Private.OrderSwapBestAvailableQuery,
    walletStakeKeyHash?: string
  ): Promise<Public.BestAvailableSwapOrderResults> {
    const marketOrderStrategy = this.configService.getMarketOrderFillStrategy();

    const bestAvailableOrderSwapResults =
      await this.getBestAvailableOrderSwapResults(
        context,
        query,
        marketOrderStrategy,
        walletStakeKeyHash
      );

    const {result, alternativeResult} = bestAvailableOrderSwapResults;

    const marketOrderPriceData = await this.getMarketOrderPriceData(
      context,
      query,
      result
    );

    const marketOrderResults: Private.MarketOrderResults | null =
      marketOrderPriceData
        ? {
            marketOrderPriceData,
            marketOrderFillAmountAssetId: query.fromAssetId,
            marketOrderSwaps: result,
          }
        : null;

    const alternativeMarketOrderPriceData = await this.getMarketOrderPriceData(
      context,
      query,
      alternativeResult
    );

    const alternativeMarketOrderResults: Private.MarketOrderResults | null =
      alternativeMarketOrderPriceData
        ? {
            marketOrderPriceData: alternativeMarketOrderPriceData,
            marketOrderFillAmountAssetId: query.fromAssetId,
            marketOrderSwaps: alternativeResult,
          }
        : null;

    const publicMarketOrderSwapResults = marketOrderResults
      ? await this.toPublicMarketOrderSwapResults(context, marketOrderResults)
      : null;

    const alternativePublicMarketOrderSwapResults =
      alternativeMarketOrderResults
        ? await this.toPublicMarketOrderSwapResults(
            context,
            alternativeMarketOrderResults
          )
        : null;

    return {
      marketOrderSwapResults: publicMarketOrderSwapResults,
      alternativeMarketOrderSwapResults:
        alternativePublicMarketOrderSwapResults,
    };
  }

  async getBestAvailableOrderSwapResults(
    context: TransactionalContext,
    query: Private.OrderSwapBestAvailableQuery,
    marketOrderStrategy: MarketOrderStrategy,
    walletStakeKeyHash?: string
  ): Promise<Private.BestAvailableOrderSwapResultsWithAlternativeOrder> {
    const {
      toAssetId,
      fromAssetId,
      toAssetAmount,
      fromAssetAmount,
      slippagePercent,
    } = query;

    switch (marketOrderStrategy) {
      case 'SINGLE_FILL': {
        const maximumNumberOfOrdersSingleFill =
          this.configService.getMarketOrderSingleFillMaximumNumberOfOrders();
        const singleFillResult =
          await this.orderSwapRepository.listOrderSwapsBestAvailableSingleFill(
            context,
            toAssetId,
            fromAssetId,
            BigInt(toAssetAmount || '0'),
            BigInt(fromAssetAmount || '0'),
            slippagePercent || 0,
            maximumNumberOfOrdersSingleFill,
            walletStakeKeyHash
          );

        const validOrderSwap =
          this.pickOneRandomFromOrdersOrThrow(singleFillResult);

        return {
          result: this.toBestAvailableOrderSwapResults(
            validOrderSwap,
            BigInt(toAssetAmount || '0')
          ),
          alternativeResult: [],
        };
      }

      case 'MULTI_FILL_NAIVE': {
        const maximumNumberOfOrdersMultiFill =
          this.configService.getMarketOrderMultiFillMaximumNumberOfOrders();
        const multiFillResults =
          await this.orderSwapRepository.listOrderSwapsBestAvailableMultiFillNaive(
            context,
            toAssetId,
            fromAssetId,
            BigInt(toAssetAmount || '0'),
            maximumNumberOfOrdersMultiFill,
            walletStakeKeyHash
          );

        const bestAvailableOrderSwapResults =
          this.toBestAvailableOrderSwapResults(
            multiFillResults,
            BigInt(toAssetAmount || '0')
          );

        if (
          bestAvailableOrderSwapResults.length === 0 ||
          this.orderSwapService.calculateTotalToAssetAmountRequired(
            bestAvailableOrderSwapResults
          ) < new Big(toAssetAmount || '0')
        ) {
          throw new PublicError(
            ErrorCode.ORDER__BEST_AVAILABLE_ORDER_NOT_FOUND
          );
        }

        return {
          result: bestAvailableOrderSwapResults,
          alternativeResult: [],
        };
      }

      case 'MULTI_FILL_POSTGRES_KNAPSACK': {
        const maximumNumberOfOrdersMultiFill =
          this.configService.getMarketOrderMultiFillMaximumNumberOfOrders();
        const {result, alternativeResult} =
          await this.orderSwapRepository.listOrderSwapsBestAvailableMultiFillKnapsack(
            context,
            toAssetId,
            fromAssetId,
            BigInt(toAssetAmount || '0'),
            maximumNumberOfOrdersMultiFill,
            walletStakeKeyHash
          );

        const results = this.toBestAvailableOrderSwapResults(
          result,
          BigInt(toAssetAmount || '0')
        );

        const alternativeResults = this.toBestAvailableOrderSwapResults(
          alternativeResult,
          BigInt(toAssetAmount || '0')
        );

        return {
          result: results,
          alternativeResult: alternativeResults,
        };
      }

      default:
        throw new ApplicationError(ErrorCode.UNHANDLED_MARKET_ORDER_STRATEGY);
    }
  }

  private async toPublicMarketOrderSwapResults(
    context: TransactionalContext,
    marketOrderResults: Private.MarketOrderResults
  ): Promise<Public.BestAvailableSwapOrderResults['marketOrderSwapResults']> {
    const orderSwaps = await Promise.all(
      marketOrderResults.marketOrderSwaps.map(
        async ({marketOrderSwap, marketOrderSwapFillAmount}) => {
          const {streamEvents} =
            await this.eventStreamRepository.getEventStreamByStreamId(
              context,
              marketOrderSwap.orderSwapId,
              eventFilterOption.ORDER_SWAP
            );
          const orderSwapAssetsIds = Private.getOrdersSwapAssetIds([
            marketOrderSwap,
          ]);
          const orderSwapAssetsMap =
            await this.assetRepository.getAssetsMapByAssetIds(
              context,
              orderSwapAssetsIds
            );

          const publicOrderSwap = this.domainMapper.toPublicOrderSwaps(
            orderSwapAssetsMap,
            {orderSwap: marketOrderSwap, streamEvents}
          );

          return {
            marketOrderSwap: publicOrderSwap,
            marketOrderSwapFillAmount,
          };
        }
      )
    );

    const {
      displayUnitPrice,
      displayUnitPriceAssetId,
      marketOrderSwapFilledAmount,
      marketOrderSwapTotalFillAmount,
    } = marketOrderResults.marketOrderPriceData;

    return {
      displayUnitPrice: displayUnitPrice,
      displayUnitPriceAssetId: displayUnitPriceAssetId,
      marketOrderSwapFilledAmount: marketOrderSwapFilledAmount,
      marketOrderSwapTotalFillAmount: marketOrderSwapTotalFillAmount,
      marketOrderFillAmountAssetId:
        marketOrderResults.marketOrderFillAmountAssetId,
      marketOrderSwaps: orderSwaps,
    };
  }

  private toBestAvailableOrderSwapResults(
    orderSwaps: Private.ValidOrderSwap[],
    toAssetAmount: bigint
  ): Private.BestAvailableOrderSwapResults {
    if (orderSwaps.length === 0) {
      return [];
    }

    const [currentOrderSwap, ...remainingOrderSwaps] = orderSwaps;

    const fillAmount = BigInt(
      minNumeric(toAssetAmount, currentOrderSwap.toAssetAmountTotalRemaining)
    );
    const newToAssetAmount = toAssetAmount - fillAmount;

    const priceBig = new Big(currentOrderSwap.price);

    // Rounding up to avoid leaving dust when filling a full order
    const amountReceived = new Big(fillAmount.toString())
      .mul(priceBig)
      .round(0, 3);

    // Ceiling the rounded up value in case it exceeds the remaining amount in an order
    const amountReceivedCeiling = new Big(
      currentOrderSwap.fromAssetAmountTotalRemaining.toString()
    );

    const amountReceivedCeiled = amountReceived.gt(amountReceivedCeiling)
      ? amountReceivedCeiling
      : amountReceived;

    if (amountReceivedCeiled.gt(0)) {
      // Filter: Only include orders with non-zero fill amount
      const orderSwapWithFills = {
        marketOrderSwap: currentOrderSwap,
        marketOrderSwapFillAmount: amountReceivedCeiled.toString(),
        marketOrderSwapToAmount: fillAmount.toString(),
      };

      return [
        orderSwapWithFills,
        ...this.toBestAvailableOrderSwapResults(
          remainingOrderSwaps,
          newToAssetAmount
        ),
      ];
    } else {
      // Recurse without including the current order
      return this.toBestAvailableOrderSwapResults(
        remainingOrderSwaps,
        newToAssetAmount
      );
    }
  }

  private pickOneRandomFromOrdersOrThrow(
    bestAvailableOrderSwaps: Private.ValidOrderSwap[]
  ): Private.ValidOrderSwap[] {
    if (isEmpty(bestAvailableOrderSwaps)) {
      throw new PublicError(ErrorCode.ORDER__BEST_AVAILABLE_ORDER_NOT_FOUND);
    } else {
      const oneRandomPickedBestAvailableOrderSwap =
        bestAvailableOrderSwaps[randomInt(bestAvailableOrderSwaps.length)];

      return [oneRandomPickedBestAvailableOrderSwap];
    }
  }

  async rebuildAllOrderSwaps(prismaClient: Prisma.PrismaClient) {
    const eventStreamIds =
      await this.eventStreamRepository.getAllEventStreamIds(
        prismaClient,
        eventFilterOption.ORDER_SWAP
      );

    for (const {streamId: orderSwapId} of eventStreamIds) {
      try {
        await prismaClient.$transaction(
          async prisma =>
            await this.createOrUpdateOrderSwapByEventStreamIdOrThrow(
              prisma,
              orderSwapId
            ),
          this.configService.getPrismaTransactionOptions()
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  private async getMarketOrderPriceData(
    context: TransactionalContext,
    query: Private.OrderSwapBestAvailableQuery,
    orderSwaps: Private.BestAvailableOrderSwapResults
  ): Promise<Private.MarketOrderPriceData | null> {
    const {decimalPrecision: toAssetDecimalPrecision} =
      await this.assetRepository.getAssetByAssetId(context, query.toAssetId);
    const {decimalPrecision: fromAssetDecimalPrecision} =
      await this.assetRepository.getAssetByAssetId(context, query.fromAssetId);

    const {decimalPrecisionDiff, unitPriceDiffMultiplier} =
      this.marketOrderPriceService.calculateUnitPriceDiffMultiplier(
        fromAssetDecimalPrecision,
        toAssetDecimalPrecision
      );

    const totalToAssetAmountRequired = sumBy(orderSwaps, swap =>
      Number(swap.marketOrderSwapFillAmount)
    );

    if (totalToAssetAmountRequired === 0) {
      return null;
    }

    const totalFromAssetAmountToBeFilled = sumBy(orderSwaps, swap =>
      Number(swap.marketOrderSwapToAmount)
    );

    const marketOrderPrice = new Big(totalFromAssetAmountToBeFilled ?? 0).div(
      totalToAssetAmountRequired
    );

    const displayUnitPrice = this.marketOrderPriceService
      .calculateDisplayUnitPrice(
        decimalPrecisionDiff,
        unitPriceDiffMultiplier,
        marketOrderPrice
      )
      .toString();

    return {
      displayUnitPrice,
      displayUnitPriceAssetId: query.toAssetId,
      marketOrderSwapFilledAmount: totalFromAssetAmountToBeFilled.toString(),
      marketOrderSwapTotalFillAmount: totalToAssetAmountRequired.toString(),
    };
  }

  async createOrUpdateOrderSwapByEventStreamIdOrThrow(
    context: TransactionalContext,
    orderSwapId: string
  ): Promise<void> {
    const eventStream =
      await this.eventStreamRepository.getEventStreamByStreamId(
        context,
        orderSwapId
      );

    const lastEvent = last(eventStream.streamEvents);

    if (lastEvent)
      await this.domainEventListenerProjections.handleEventStreamMutation(
        context,
        lastEvent,
        eventStream,
        this.eventStreamRepository
      );
  }

  private async getOrCreateEventStreamByMintAssetId(
    context: TransactionalContext,
    mintAssetId: string
  ): Promise<EventStream<OrderSwapEvent>> {
    return (
      (await this.getEventStreamByMintAssetId(context, mintAssetId)) ||
      this.eventStreamRepository.newEventStream()
    );
  }

  private async getEventStreamByMintAssetId(
    context: TransactionalContext,
    mintAssetId: string
  ): Promise<EventStream<OrderSwapEvent> | null> {
    const orderSwap = await this.orderSwapRepository.getOrderSwapByMintAssetId(
      context,
      mintAssetId
    );

    if (orderSwap) {
      const eventStream =
        await this.eventStreamRepository.getEventStreamByStreamId(
          context,
          orderSwap.orderSwapId,
          eventFilterOption.ORDER_SWAP
        );
      return eventStream;
    } else {
      return null;
    }
  }

  private async getToAsset(
    prisma: Prisma.Prisma.TransactionClient,
    orderData: Public.SwapOrderData
  ): Promise<Core.ToAssetAndAmount> {
    const {toAssetId, toAssetAmount} = orderData;

    const {assetName: toAssetName, policyId: toAssetPolicyId} =
      await this.assetRepository.getAssetByAssetId(prisma, toAssetId);

    return {
      toAssetId,
      toAssetName,
      toAssetPolicyId,
      toAssetAmount,
    };
  }

  private async getFromAsset(
    prisma: Prisma.Prisma.TransactionClient,
    orderData: Public.SwapOrderData
  ): Promise<Core.FromAssetAndAmount> {
    const {fromAssetId, fromAssetAmount} = orderData;

    const {assetName: fromAssetName, policyId: fromAssetPolicyId} =
      await this.assetRepository.getAssetByAssetId(prisma, fromAssetId);

    return {
      fromAssetId,
      fromAssetName,
      fromAssetPolicyId,
      fromAssetAmount,
    };
  }
}
