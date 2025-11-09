import {injectable} from 'tsyringe';

import {
  DomainEventsHandler,
  EventTypes,
  OrderSwapCancelOnChainSuccessEvent,
  OrderSwapFillInitFailureEvent,
  OrderSwapFillInitRequestEvent,
  OrderSwapFillInitSuccessEvent,
  OrderSwapFillOnChainSuccessEvent,
  OrderSwapFillSubmitFailureEvent,
  OrderSwapFinalFillOnChainSuccessEvent,
  OrderSwapOpenInitFailureEvent,
  OrderSwapOpenInitRequestEvent,
  OrderSwapOpenInitSuccessEvent,
  OrderSwapOpenOnChainSuccessEvent,
  OrderSwapOpenSubmitFailureEvent,
  OrderSwapPartialFillOnChainSuccessEvent,
  isOrderSwapCancelInitFailureEvent,
  isOrderSwapCancelOnChainSuccessEvent,
  isOrderSwapFillInitFailureEvent,
  isOrderSwapFillInitRequestEvent,
  isOrderSwapFillInitSuccessEvent,
  isOrderSwapFillOnChainSuccessEvent,
  isOrderSwapFillSubmitFailureEvent,
  isOrderSwapFinalFillOnChainSuccessEvent,
  isOrderSwapOpenInitFailureEvent,
  isOrderSwapOpenInitRequestEvent,
  isOrderSwapOpenInitSuccessEvent,
  isOrderSwapOpenOnChainSuccessEvent,
  isOrderSwapOpenSubmitFailureEvent,
  isOrderSwapPartialFillOnChainSuccessEvent,
  isOrderSwapOpenOnChainFailureEvent,
  OrderSwapOpenOnChainFailureEvent,
  isDomainEventTransaction,
  OrderSwapEventType,
  OrderSwapEvent,
} from '~/domain/events';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {AbstractReducer} from '~/domain/events/reducer';

import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';

import {div} from '~/domain/utils/math.util';
import {dateOrNull, epochInSecondsToDate} from '~/domain/utils/date.util';
import {
  isOrderSwapFillOnChainFailureEvent,
  OrderSwapFillOnChainFailureEvent,
} from '../../orderSwap/OrderSwapFillOnChainFailureEvent';
import {excludeInvalidatedEvents} from './shared/eventPreProcessor';

const noOp = (state: Private.OrderSwap): Private.OrderSwap => state;

const getEffectiveDates = ({
  effectiveFromDate,
  effectiveUntilDate,
}: Public.SwapOrderData) => ({
  effectiveFromDate: dateOrNull(effectiveFromDate),
  effectiveUntilDate: dateOrNull(effectiveUntilDate),
});

const {OPEN, PENDING, FAILED, FILLED, CANCELLED} = Private.OrderStatus;

const orderSwapStatusMap: Record<OrderSwapEventType, Private.OrderStatus> = {
  // LIMIT OPEN
  [EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST]: PENDING,
  [EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS]: PENDING,
  [EventTypes.ORDER_SWAP__OPEN_INIT__FAILURE]: FAILED,
  [EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS]: PENDING,
  [EventTypes.ORDER_SWAP__OPEN_SUBMIT__FAILURE]: FAILED,
  [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS]: OPEN,
  [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE]: FAILED,

  // LIMIT PRODUCER FILL
  [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS]: OPEN,
  [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE]: OPEN, // excluded from stream
  [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS]: FILLED,
  [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE]: OPEN, // excluded from stream

  // LIMIT CONSUMER FILL
  [EventTypes.ORDER_SWAP__FILL_INIT__REQUEST]: PENDING,
  [EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS]: PENDING,
  [EventTypes.ORDER_SWAP__FILL_INIT__FAILURE]: FAILED,
  [EventTypes.ORDER_SWAP__FILL_SUBMIT__SUCCESS]: PENDING,
  [EventTypes.ORDER_SWAP__FILL_SUBMIT__FAILURE]: FAILED,
  [EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS]: FILLED,
  [EventTypes.ORDER_SWAP__FILL_ONCHAIN__FAILURE]: FAILED,

  // CANCELLED
  [EventTypes.ORDER_SWAP__CANCEL_INIT__REQUEST]: OPEN,
  [EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS]: OPEN,
  [EventTypes.ORDER_SWAP__CANCEL_INIT__FAILURE]: OPEN,
  [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__SUCCESS]: OPEN,
  [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__FAILURE]: OPEN,
  [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS]: CANCELLED,
  [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE]: OPEN, // excluded from stream
};

@injectable()
export class OrderSwapReducer extends AbstractReducer<
  Private.OrderSwap,
  OrderSwapEvent
> {
  protected getInitialState(orderSwapId: string): Private.OrderSwap {
    return {
      orderSwapId,

      orderType: null,
      orderStatus: null,
      orderStatusTransactionHash: null,
      cancellationTransactionHash: null,

      userId: null,

      toAssetId: '',
      fromAssetId: '',

      price: NaN,
      priceNumerator: null,
      priceDenominator: null,

      toAssetAmount: BigInt(0),
      fromAssetAmount: BigInt(0),

      toAssetAmountTotalRemaining: BigInt(0),
      fromAssetAmountTotalRemaining: BigInt(0),

      toAssetAmountTotalFilled: BigInt(0),
      fromAssetAmountTotalFilled: BigInt(0),

      takerLovelaceFlatFeeAmount: null,
      transactionFeeAmount: null,
      cancellationTransactionFeeAmount: null,

      // LIMIT ORDER EXCLUSIVE FIELDS
      mintAssetId: null,

      depositAmount: null,
      makerLovelaceFlatFeeAmount: null,
      makerFromAssetFeePercent: null,
      makerFromAssetFeeAmount: null,
      takerFromAssetFeePercent: null,
      takerFromAssetFeeAmount: null,

      partialFillCount: 0,

      utxoReferenceTransactionHash: null,
      utxoReferenceIndex: null,

      effectiveFromDate: null,
      effectiveUntilDate: null,

      orderDate: new Date(),
      transactionDateOpen: null,
      transactionDateFill: null,
      transactionDateFinalFill: null,
      transactionDateCancel: null,

      created: new Date(),
      updated: new Date(),
    };
  }

  eventPreProcessor = excludeInvalidatedEvents;

  getEventsHandler(): DomainEventsHandler<Private.OrderSwap, OrderSwapEvent> {
    return {
      // OPEN
      [EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST]:
        this.handleIfOrderSwapOpenInitRequestEvent.bind(this),

      [EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS]:
        this.handleIfOrderSwapOpenInitSuccessEvent.bind(this),

      [EventTypes.ORDER_SWAP__OPEN_INIT__FAILURE]:
        this.handleIfOrderSwapOpenInitFailureEvent.bind(this),

      [EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS]: noOp,

      [EventTypes.ORDER_SWAP__OPEN_SUBMIT__FAILURE]:
        this.handleIfOrderSwapOpenSubmitFailureEvent.bind(this),

      [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS]:
        this.handleIfOrderSwapOpenOnChainSuccessEvent.bind(this),

      [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE]:
        this.handleIfOrderSwapOpenOnChainFailureEvent.bind(this),

      // PRODUCER FILL
      [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS]:
        this.handleIfOrderSwapPartialFillOnChainSuccessEvent.bind(this),

      [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE]: noOp, // excluded from stream

      [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS]:
        this.handleIfOrderSwapFinalFillOnChainSuccessEvent.bind(this),

      [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE]: noOp, // excluded from stream

      // CONSUMER FILL

      [EventTypes.ORDER_SWAP__FILL_INIT__REQUEST]:
        this.handleIfOrderSwapFillInitRequestEvent.bind(this),

      [EventTypes.ORDER_SWAP__FILL_INIT__FAILURE]:
        this.handleIfOrderSwapFillInitFailureEvent.bind(this),

      [EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS]:
        this.handleIfOrderSwapFillInitSuccessEvent.bind(this),

      [EventTypes.ORDER_SWAP__FILL_SUBMIT__SUCCESS]: noOp,

      [EventTypes.ORDER_SWAP__FILL_SUBMIT__FAILURE]:
        this.handleIfOrderSwapFillSubmitFailureEvent.bind(this),

      [EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS]:
        this.handleIfOrderSwapFillOnChainSuccessEvent.bind(this),

      [EventTypes.ORDER_SWAP__FILL_ONCHAIN__FAILURE]:
        this.handleIfOrderSwapFillOnChainFailureEvent.bind(this),

      // Cancel
      [EventTypes.ORDER_SWAP__CANCEL_INIT__REQUEST]: noOp,

      [EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS]: noOp,

      [EventTypes.ORDER_SWAP__CANCEL_INIT__FAILURE]:
        this.handleIfOrderSwapCancelInitFailureEvent.bind(this),

      [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__SUCCESS]: noOp,

      [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__FAILURE]: noOp,

      [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS]:
        this.handleIfOrderSwapCancelOnChainSuccessEvent.bind(this),

      [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE]: noOp, // excluded from stream
    };
  }

  private handleIfOrderSwapOpenInitRequestEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapOpenInitRequestEvent(event)) {
      return this.handleOrderSwapOpenInitRequestEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapOpenInitSuccessEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapOpenInitSuccessEvent(event)) {
      return this.handleOrderSwapOpenInitSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapOpenInitFailureEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapOpenInitFailureEvent(event)) {
      return this.handleOrderSwapOpenInitFailureEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapOpenSubmitFailureEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapOpenSubmitFailureEvent(event)) {
      return this.handleOrderSwapOpenSubmitFailureEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapOpenOnChainSuccessEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapOpenOnChainSuccessEvent(event)) {
      return this.handleOrderSwapOpenOnChainSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapOpenOnChainFailureEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapOpenOnChainFailureEvent(event)) {
      return this.handleOrderSwapOpenOnChainFailureEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapPartialFillOnChainSuccessEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapPartialFillOnChainSuccessEvent(event)) {
      return this.handleOrderSwapPartialFillOnChainSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapFinalFillOnChainSuccessEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapFinalFillOnChainSuccessEvent(event)) {
      return this.handleOrderSwapFinalFillOnChainSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapFillInitRequestEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapFillInitRequestEvent(event)) {
      return this.handleOrderSwapFillInitRequestEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapFillInitFailureEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapFillInitFailureEvent(event)) {
      return this.handleOrderSwapFillInitFailureEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapFillInitSuccessEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapFillInitSuccessEvent(event)) {
      return this.handleOrderSwapFillInitSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapFillSubmitFailureEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapFillSubmitFailureEvent(event)) {
      return this.handleOrderSwapFillSubmitFailureEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapFillOnChainSuccessEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapFillOnChainSuccessEvent(event)) {
      return this.handleOrderSwapFillOnChainSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapFillOnChainFailureEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapFillOnChainFailureEvent(event)) {
      return this.handleOrderSwapFillOnChainFailureEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapCancelInitFailureEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapCancelInitFailureEvent(event)) {
      return state;
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapCancelOnChainSuccessEvent(
    state: Private.OrderSwap,
    event: OrderSwapEvent
  ): Private.OrderSwap {
    if (isOrderSwapCancelOnChainSuccessEvent(event)) {
      return this.handleOrderSwapCancelOnChainSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleOrderSwapOpenInitRequestEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapOpenInitRequestEvent
  ): Private.OrderSwap {
    const {eventPayload: orderSwapData, created: orderSwapEventCreated} =
      orderSwapEvent;

    const {
      userId,
      orderType,
      toAssetId,
      fromAssetId,
      toAssetAmount,
      fromAssetAmount,
    } = orderSwapData;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      orderStatus,
      orderStatusTransactionHash,

      userId,

      orderType,

      toAssetId,
      fromAssetId,

      toAssetAmount: BigInt(toAssetAmount),
      fromAssetAmount: BigInt(fromAssetAmount),

      toAssetAmountTotalFilled: BigInt(0),
      fromAssetAmountTotalFilled: BigInt(0),

      toAssetAmountTotalRemaining: BigInt(toAssetAmount),
      fromAssetAmountTotalRemaining: BigInt(fromAssetAmount),

      price: div(fromAssetAmount, toAssetAmount),

      ...getEffectiveDates(orderSwapData),

      created: orderSwapEventCreated,
      updated: orderSwapEventCreated,

      orderDate: orderSwapEventCreated,
    };
  }

  private handleOrderSwapOpenInitFailureEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapOpenInitFailureEvent
  ): Private.OrderSwap {
    const {created: orderSwapEventCreated} = orderSwapEvent;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      orderStatus,
      orderStatusTransactionHash,

      created: orderSwapEventCreated,
      updated: orderSwapEventCreated,

      orderDate: orderSwapEventCreated,

      mintAssetId: null,
    };
  }

  private handleOrderSwapOpenInitSuccessEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapOpenInitSuccessEvent
  ): Private.OrderSwap {
    const {eventPayload: orderSwapData, created: orderSwapEventCreated} =
      orderSwapEvent;

    const {
      userId,
      mintAssetId,
      depositAmount,
      makerLovelaceFlatFeeAmount,
      makerFromAssetFeePercent,
      makerFromAssetFeeAmount,
      transactionFeeAmount,
    } = orderSwapData;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      mintAssetId,

      orderStatus,
      orderStatusTransactionHash,

      userId,

      depositAmount: BigInt(depositAmount),
      makerLovelaceFlatFeeAmount: BigInt(makerLovelaceFlatFeeAmount),
      makerFromAssetFeePercent: Number(makerFromAssetFeePercent),
      makerFromAssetFeeAmount: BigInt(makerFromAssetFeeAmount),
      transactionFeeAmount: BigInt(transactionFeeAmount),

      created: orderSwapEventCreated,
      updated: orderSwapEventCreated,

      orderDate: orderSwapEventCreated,
    };
  }

  private handleOrderSwapOpenSubmitFailureEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapOpenSubmitFailureEvent
  ): Private.OrderSwap {
    const {created: orderSwapEventCreated} = orderSwapEvent;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      orderStatus,
      orderStatusTransactionHash,

      created: orderSwapEventCreated,
      updated: orderSwapEventCreated,

      orderDate: orderSwapEventCreated,

      mintAssetId: null,
    };
  }

  /**
   * @NOTE Special case. See return type: ValidOrderSwap
   * Must represent all required data of a valid swap order.
   * Required to support orders opened from third parties.
   */
  private handleOrderSwapOpenOnChainSuccessEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapOpenOnChainSuccessEvent
  ): Private.OrderSwap {
    const {eventPayload: orderSwapData, created: orderSwapEventCreated} =
      orderSwapEvent;

    const {
      toAssetId,
      fromAssetId,
      toAssetAmount,
      fromAssetAmount,
      toAssetAmountTotalFilled,
      fromAssetAmountTotalFilled,
      toAssetAmountTotalRemaining,
      fromAssetAmountTotalRemaining,
      utxoReferenceTransactionHash,
      utxoReferenceIndex,
      mintAssetId,
      orderType,
      userId,
      effectiveFromDate,
      effectiveUntilDate,
      transactionFeeAmount,
      transactionTimestamp,
      price,
      priceNumerator,
      priceDenominator,
      makerLovelaceFlatFeeAmount,
      makerFromAssetFeeAmount,
      makerFromAssetFeePercent,
    } = orderSwapData;

    const transactionDate = epochInSecondsToDate(transactionTimestamp);

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      userId,
      orderType,

      orderStatus,
      orderStatusTransactionHash,

      toAssetId,
      fromAssetId,

      price,
      priceNumerator,
      priceDenominator,

      toAssetAmount: BigInt(toAssetAmount),
      fromAssetAmount: BigInt(fromAssetAmount),

      toAssetAmountTotalRemaining: BigInt(toAssetAmountTotalRemaining),
      fromAssetAmountTotalRemaining: BigInt(fromAssetAmountTotalRemaining),

      toAssetAmountTotalFilled: BigInt(toAssetAmountTotalFilled),
      fromAssetAmountTotalFilled: BigInt(fromAssetAmountTotalFilled),

      makerLovelaceFlatFeeAmount: BigInt(makerLovelaceFlatFeeAmount),
      makerFromAssetFeeAmount: BigInt(makerFromAssetFeeAmount),
      makerFromAssetFeePercent: Number(makerFromAssetFeePercent),

      utxoReferenceTransactionHash,
      utxoReferenceIndex,

      mintAssetId,

      effectiveFromDate,
      effectiveUntilDate,

      transactionFeeAmount: BigInt(transactionFeeAmount),

      updated: orderSwapEventCreated,

      orderDate: transactionDate,
      transactionDateOpen: transactionDate,
    };
  }

  private handleOrderSwapOpenOnChainFailureEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapOpenOnChainFailureEvent
  ): Private.OrderSwap {
    const {
      eventPayload: {userId},
      created: orderSwapEventCreated,
    } = orderSwapEvent;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,
      userId,
      orderStatus,
      orderStatusTransactionHash,
      updated: orderSwapEventCreated,
    };
  }

  /**
   * @NOTE Special case. See return type: ValidOrderSwap
   * Must represent all required data of a valid swap order.
   * Required to support orders opened which have not been ingested as open.
   * These orders are problematic and should be investigated.
   * The oura handler should emit error logs.
   */
  private handleOrderSwapPartialFillOnChainSuccessEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapPartialFillOnChainSuccessEvent
  ): Private.OrderSwap {
    const {eventPayload: orderSwapData, created: orderSwapEventCreated} =
      orderSwapEvent;

    const {
      toAssetId,
      fromAssetId,
      toAssetAmountTotalFilled,
      fromAssetAmountTotalFilled,
      toAssetAmountTotalRemaining,
      fromAssetAmountTotalRemaining,
      utxoReferenceTransactionHash,
      utxoReferenceIndex,
      mintAssetId,
      orderType,
      userId,
      effectiveFromDate,
      effectiveUntilDate,
      price,
      priceNumerator,
      priceDenominator,
      partialFillCount,
    } = orderSwapData;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      userId,
      orderType,

      orderStatus,
      orderStatusTransactionHash,

      toAssetId,
      fromAssetId,

      price,
      priceNumerator,
      priceDenominator,

      toAssetAmountTotalFilled: BigInt(toAssetAmountTotalFilled),
      fromAssetAmountTotalFilled: BigInt(fromAssetAmountTotalFilled),

      toAssetAmountTotalRemaining: BigInt(toAssetAmountTotalRemaining),
      fromAssetAmountTotalRemaining: BigInt(fromAssetAmountTotalRemaining),

      partialFillCount,

      utxoReferenceTransactionHash,
      utxoReferenceIndex,

      mintAssetId,

      effectiveFromDate,
      effectiveUntilDate,

      updated: orderSwapEventCreated,
    };
  }

  private handleOrderSwapFinalFillOnChainSuccessEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapFinalFillOnChainSuccessEvent
  ): Private.OrderSwap {
    const {
      eventPayload: {
        toAssetAmountTotalFilled, // Must be fully filled
        fromAssetAmountTotalFilled, // Must be fully filled
        toAssetAmountTotalRemaining, // Must be 0 remaining
        fromAssetAmountTotalRemaining, // Must be 0 remaining
        price,
        priceNumerator,
        priceDenominator,
      },
      created: orderSwapEventCreated,
    } = orderSwapEvent;

    // TODO Add test to Raise alarm if values do not meet expectations

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      orderStatus,
      orderStatusTransactionHash,

      updated: orderSwapEventCreated,

      price,
      priceNumerator,
      priceDenominator,

      toAssetAmountTotalFilled: BigInt(toAssetAmountTotalFilled),
      fromAssetAmountTotalFilled: BigInt(fromAssetAmountTotalFilled),
      toAssetAmountTotalRemaining: BigInt(toAssetAmountTotalRemaining),
      fromAssetAmountTotalRemaining: BigInt(fromAssetAmountTotalRemaining),
    };
  }

  private handleOrderSwapFillInitRequestEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapFillInitRequestEvent
  ): Private.OrderSwap {
    const {
      eventPayload: {userId, orderType, toAssetAmount},
    } = orderSwapEvent;

    const {created: orderSwapEventCreated} = orderSwapEvent;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,
      userId,

      orderType,

      orderStatus,
      orderStatusTransactionHash,

      toAssetAmount: BigInt(toAssetAmount),

      created: orderSwapEventCreated,
      updated: orderSwapEventCreated,

      orderDate: orderSwapEventCreated,
    };
  }

  private handleOrderSwapFillInitFailureEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapFillInitFailureEvent
  ): Private.OrderSwap {
    const {created: orderSwapEventCreated} = orderSwapEvent;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      orderStatus,
      orderStatusTransactionHash,

      created: orderSwapEventCreated,
      updated: orderSwapEventCreated,

      orderDate: orderSwapEventCreated,
    };
  }

  private handleOrderSwapFillInitSuccessEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapFillInitSuccessEvent
  ): Private.OrderSwap {
    const {
      eventPayload: {
        userId,
        toAssetId,
        fromAssetId,
        toAssetAmount,
        fromAssetAmount,
        takerFromAssetFeeAmount,
        takerFromAssetFeePercent,
        takerLovelaceFlatFeeAmount,
        transactionFeeAmount,
        price,
        priceNumerator,
        priceDenominator,
      },
    } = orderSwapEvent;

    const {created: orderSwapEventCreated} = orderSwapEvent;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      userId,

      orderStatus,
      orderStatusTransactionHash,

      toAssetId,
      fromAssetId,

      toAssetAmount: BigInt(toAssetAmount),
      fromAssetAmount: BigInt(fromAssetAmount),

      takerLovelaceFlatFeeAmount: BigInt(takerLovelaceFlatFeeAmount),
      takerFromAssetFeePercent:
        undefined === takerFromAssetFeePercent
          ? null
          : Number(takerFromAssetFeePercent),
      takerFromAssetFeeAmount:
        undefined === takerFromAssetFeeAmount
          ? null
          : BigInt(takerFromAssetFeeAmount),
      transactionFeeAmount: BigInt(transactionFeeAmount),

      price,
      priceNumerator,
      priceDenominator,

      created: orderSwapEventCreated,
      updated: orderSwapEventCreated,

      orderDate: orderSwapEventCreated,
    };
  }

  private handleOrderSwapFillSubmitFailureEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapFillSubmitFailureEvent
  ): Private.OrderSwap {
    const {created: orderSwapEventCreated} = orderSwapEvent;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      orderStatus,
      orderStatusTransactionHash,

      created: orderSwapEventCreated,
      updated: orderSwapEventCreated,

      orderDate: orderSwapEventCreated,
    };
  }

  private handleOrderSwapFillOnChainSuccessEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapFillOnChainSuccessEvent
  ): Private.OrderSwap {
    const {
      eventPayload: {
        transactionTimestamp,
        toAssetAmount,
        fromAssetAmount,
        price,
        priceDenominator,
        priceNumerator,
      },
      created: orderSwapEventCreated,
    } = orderSwapEvent;

    const transactionDate = epochInSecondsToDate(transactionTimestamp);

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,

      orderStatus,
      orderStatusTransactionHash,

      price,
      priceNumerator,
      priceDenominator,

      toAssetAmountTotalFilled: BigInt(toAssetAmount),
      fromAssetAmountTotalFilled: BigInt(fromAssetAmount),

      updated: orderSwapEventCreated,

      orderDate: transactionDate,
      transactionDateFill: transactionDate,
    };
  }

  private handleOrderSwapFillOnChainFailureEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapFillOnChainFailureEvent
  ): Private.OrderSwap {
    const {
      eventPayload: {userId},
      created: orderSwapEventCreated,
    } = orderSwapEvent;

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    return {
      ...orderSwap,
      userId,
      orderStatus,
      orderStatusTransactionHash,
      updated: orderSwapEventCreated,
    };
  }

  private handleOrderSwapCancelOnChainSuccessEvent(
    orderSwap: Private.OrderSwap,
    orderSwapEvent: OrderSwapCancelOnChainSuccessEvent
  ): Private.OrderSwap {
    const {fromAssetAmountTotalFilled, makerFromAssetFeePercent} = orderSwap;

    const {
      eventPayload: {userId, transactionTimestamp, transactionFeeAmount},
      created: orderSwapEventCreated,
    } = orderSwapEvent;

    const transactionDate = epochInSecondsToDate(transactionTimestamp);

    const {orderStatus, orderStatusTransactionHash} =
      this.deriveOrderSwapStatusWithTransactionHash(orderSwapEvent);

    const makerFromAssetFeeAmount = Math.ceil(
      Number(fromAssetAmountTotalFilled) *
        (Number(makerFromAssetFeePercent) / 100)
    );

    const makerLovelaceFlatFeeAmount =
      Number(fromAssetAmountTotalFilled) > 0
        ? orderSwap.makerLovelaceFlatFeeAmount
        : BigInt(0);

    return {
      ...orderSwap,

      userId,

      orderStatus,
      orderStatusTransactionHash,
      cancellationTransactionHash: orderSwapEvent.transactionHash,

      makerLovelaceFlatFeeAmount,
      makerFromAssetFeeAmount: BigInt(makerFromAssetFeeAmount),
      cancellationTransactionFeeAmount: BigInt(transactionFeeAmount),

      updated: orderSwapEventCreated,

      transactionDateCancel: transactionDate,
    };
  }

  private deriveOrderSwapStatusWithTransactionHash(
    orderSwapEvent: OrderSwapEvent
  ): {
    orderStatus: NonNullable<Private.OrderSwap['orderStatus']>;
    orderStatusTransactionHash: Private.OrderSwap['orderStatusTransactionHash'];
  } {
    const newOrderStatus = orderSwapStatusMap[orderSwapEvent.eventType];

    return {
      orderStatus: newOrderStatus,
      orderStatusTransactionHash: isDomainEventTransaction(orderSwapEvent)
        ? orderSwapEvent.transactionHash
        : null,
    };
  }
}
