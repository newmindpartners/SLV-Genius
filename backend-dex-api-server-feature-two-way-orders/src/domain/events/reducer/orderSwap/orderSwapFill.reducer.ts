import {injectable} from 'tsyringe';

import {
  DomainEvent,
  DomainEventsHandler,
  EventTypes,
  isOrderSwapFinalFillOnChainSuccessEvent,
  isOrderSwapOpenOnChainSuccessEvent,
  isOrderSwapPartialFillOnChainSuccessEvent,
  OrderSwapEvent,
  OrderSwapFinalFillOnChainSuccessEvent,
  OrderSwapOpenOnChainSuccessEvent,
  OrderSwapPartialFillOnChainSuccessEvent,
} from '~/domain/events';
import * as Private from '~/domain/models/private';

import {AbstractReducer} from '~/domain/events/reducer';

import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';
import {epochInSecondsToDate} from '~/domain/utils/date.util';
import {excludeInvalidatedEvents} from './shared/eventPreProcessor';

const noOp = (state: Private.OrderSwapWithFills): Private.OrderSwapWithFills =>
  state;

@injectable()
export class OrderSwapFillReducer extends AbstractReducer<
  Private.OrderSwapWithFills,
  OrderSwapEvent
> {
  protected getInitialState(orderSwapId: string): Private.OrderSwapWithFills {
    return {
      orderSwapId,

      toAssetId: '',
      fromAssetId: '',

      toAssetAmount: BigInt(0),
      fromAssetAmount: BigInt(0),

      toAssetAmountTotalRemaining: BigInt(0),
      fromAssetAmountTotalRemaining: BigInt(0),

      price: 0,
      priceNumerator: null,
      priceDenominator: null,

      orderSwapFills: [],
    };
  }

  eventPreProcessor = excludeInvalidatedEvents;

  getEventsHandler(): DomainEventsHandler<
    Private.OrderSwapWithFills,
    OrderSwapEvent
  > {
    return {
      // OPEN
      [EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST]: noOp,
      [EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS]: noOp,
      [EventTypes.ORDER_SWAP__OPEN_INIT__FAILURE]: noOp,
      [EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS]: noOp,
      [EventTypes.ORDER_SWAP__OPEN_SUBMIT__FAILURE]: noOp,
      [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS]:
        this.handleIfOrderSwapOpenOnChainSuccessEvent.bind(this),
      [EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE]: noOp,

      [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS]:
        this.handleIfOrderSwapPartialFillOnChainSuccessEvent.bind(this),
      [EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE]: noOp,

      [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS]:
        this.handleIfOrderSwapFinalFillOnChainSuccessEvent.bind(this),
      [EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE]: noOp,

      [EventTypes.ORDER_SWAP__FILL_INIT__REQUEST]: noOp,
      [EventTypes.ORDER_SWAP__FILL_INIT__FAILURE]: noOp,
      [EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS]: noOp,
      [EventTypes.ORDER_SWAP__FILL_SUBMIT__SUCCESS]: noOp,
      [EventTypes.ORDER_SWAP__FILL_SUBMIT__FAILURE]: noOp,
      [EventTypes.ORDER_SWAP__FILL_ONCHAIN__FAILURE]: noOp,
      [EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS]: noOp,

      [EventTypes.ORDER_SWAP__CANCEL_INIT__REQUEST]: noOp,
      [EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS]: noOp,
      [EventTypes.ORDER_SWAP__CANCEL_INIT__FAILURE]: noOp,
      [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__SUCCESS]: noOp,
      [EventTypes.ORDER_SWAP__CANCEL_SUBMIT__FAILURE]: noOp,
      [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS]: noOp,
      [EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE]: noOp,
    };
  }

  private handleIfOrderSwapOpenOnChainSuccessEvent(
    state: Private.OrderSwapWithFills,
    event: DomainEvent
  ): Private.OrderSwapWithFills {
    if (isOrderSwapOpenOnChainSuccessEvent(event)) {
      return this.handleOrderSwapOpenOnChainSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapPartialFillOnChainSuccessEvent(
    state: Private.OrderSwapWithFills,
    event: DomainEvent
  ): Private.OrderSwapWithFills {
    if (isOrderSwapPartialFillOnChainSuccessEvent(event)) {
      return this.handleOrderSwapPartialFillOnChainSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleIfOrderSwapFinalFillOnChainSuccessEvent(
    state: Private.OrderSwapWithFills,
    event: DomainEvent
  ): Private.OrderSwapWithFills {
    if (isOrderSwapFinalFillOnChainSuccessEvent(event)) {
      return this.handleOrderSwapFinalFillOnChainSuccessEvent(state, event);
    } else {
      throw new ApplicationError(ErrorCode.ORDER__EVENT_INCORRECT_TYPE);
    }
  }

  private handleOrderSwapOpenOnChainSuccessEvent(
    orderSwap: Private.OrderSwapWithFills,
    orderSwapEvent: OrderSwapOpenOnChainSuccessEvent
  ): Private.OrderSwapWithFills {
    const {eventPayload: orderSwapData} = orderSwapEvent;

    const {
      toAssetId,
      fromAssetId,
      toAssetAmount,
      fromAssetAmount,
      toAssetAmountTotalRemaining,
      fromAssetAmountTotalRemaining,
    } = orderSwapData;

    return {
      ...orderSwap,

      toAssetId,
      fromAssetId,

      toAssetAmount: BigInt(toAssetAmount),
      fromAssetAmount: BigInt(fromAssetAmount),

      toAssetAmountTotalRemaining: BigInt(toAssetAmountTotalRemaining),
      fromAssetAmountTotalRemaining: BigInt(fromAssetAmountTotalRemaining),
    };
  }

  private handleOrderSwapPartialFillOnChainSuccessEvent(
    orderSwap: Private.OrderSwapWithFills,
    orderSwapEvent: OrderSwapPartialFillOnChainSuccessEvent
  ): Private.OrderSwapWithFills {
    const {
      orderSwapId,
      toAssetAmountTotalRemaining: currentToAssetAmountTotalRemaining,
      fromAssetAmountTotalRemaining: currentFromAssetAmountTotalRemaining,
    } = orderSwap;

    const {
      eventPayload: {
        toAssetId,
        fromAssetId,
        toAssetAmountTotalRemaining,
        fromAssetAmountTotalRemaining,
        transactionTimestamp,
        price,
        priceNumerator,
        priceDenominator,
      },
      transactionHash,
    } = orderSwapEvent;

    const toAssetAmountFilled =
      currentToAssetAmountTotalRemaining - BigInt(toAssetAmountTotalRemaining);

    const fromAssetAmountFilled =
      currentFromAssetAmountTotalRemaining -
      BigInt(fromAssetAmountTotalRemaining);

    const transactionDateFill = epochInSecondsToDate(transactionTimestamp);

    const orderSwapFill: Private.OrderSwapFillCreate = {
      orderSwapId,

      price,
      priceNumerator,
      priceDenominator,

      toAssetId,
      fromAssetId,

      toAssetAmountFilled,
      fromAssetAmountFilled,

      transactionHash,
      transactionDateFill,
    };

    const orderSwapFills = [...orderSwap.orderSwapFills, orderSwapFill];

    return {
      ...orderSwap,

      toAssetAmountTotalRemaining: BigInt(toAssetAmountTotalRemaining),
      fromAssetAmountTotalRemaining: BigInt(fromAssetAmountTotalRemaining),

      orderSwapFills,
    };
  }

  private handleOrderSwapFinalFillOnChainSuccessEvent(
    orderSwap: Private.OrderSwapWithFills,
    orderSwapEvent: OrderSwapFinalFillOnChainSuccessEvent
  ): Private.OrderSwapWithFills {
    const {
      orderSwapId,
      toAssetAmountTotalRemaining: currentToAssetAmountTotalRemaining,
      fromAssetAmountTotalRemaining: currentFromAssetAmountTotalRemaining,
    } = orderSwap;

    const {
      eventPayload: {
        toAssetId,
        fromAssetId,
        transactionTimestamp,
        toAssetAmountTotalRemaining,
        fromAssetAmountTotalRemaining,
        price,
        priceDenominator,
        priceNumerator,
      },
      transactionHash,
    } = orderSwapEvent;

    const toAssetAmountFilled = BigInt(currentToAssetAmountTotalRemaining);

    const fromAssetAmountFilled = BigInt(currentFromAssetAmountTotalRemaining);

    const transactionDateFill = epochInSecondsToDate(transactionTimestamp);

    const orderSwapFill: Private.OrderSwapFillCreate = {
      orderSwapId,

      price,
      priceNumerator,
      priceDenominator,

      toAssetId,
      fromAssetId,

      toAssetAmountFilled,
      fromAssetAmountFilled,

      transactionHash,
      transactionDateFill,
    };

    const orderSwapFills = [...orderSwap.orderSwapFills, orderSwapFill];

    return {
      ...orderSwap,

      toAssetAmountTotalRemaining: BigInt(toAssetAmountTotalRemaining), // MUST BE ZERO
      fromAssetAmountTotalRemaining: BigInt(fromAssetAmountTotalRemaining), // MUST BE ZERO

      orderSwapFills,
    };
  }
}
