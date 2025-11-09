import * as loFp from 'lodash/fp';
import {
  OrderSwapFillInitRequestEventV1,
  OrderSwapFillInitRequestEvent,
  OrderSwapFillInitRequestEventPayload,
  OrderSwapFillInitSuccessEventV1,
  OrderSwapFillInitSuccessEvent,
  OrderSwapFillInitSuccessEventPayload,
  OrderSwapFillInitRequestEventV2,
  OrderSwapFillInitRequestEventPayloadV2,
  OrderSwapFillInitSuccessEventV2,
  EventTypes,
  OrderSwapFillInitFailureEvent,
  OrderSwapFillSubmitFailureEvent,
  OrderSwapFillSubmitSuccessEvent,
  OrderSwapFillOnChainFailureEvent,
  OrderSwapFillOnChainSuccessEvent,
  OrderSwapFillOnChainSuccessEventV1,
  OrderSwapFillOnChainSuccessEventPayload,
  OrderSwapFillInitSuccessEventPayloadV2,
} from '~/domain/events';
import {OrderSwapFillEvent} from '../OrderSwapFillEvent';

const upcastFillInitRequestEventV1ToV2 = (
  fillInitEventRequestEvent: OrderSwapFillInitRequestEventV1
): OrderSwapFillInitRequestEventV2 => {
  const {eventPayload, ...event} = fillInitEventRequestEvent;
  const {userId, orderId, orderType, baseAssetAmount} = eventPayload;
  const payloadV2: OrderSwapFillInitRequestEventPayloadV2 = {
    userId,
    orderSwapReferencesWithAmounts: [
      {
        orderReference: {orderId},
        baseAssetAmount: {baseAssetAmount},
      },
    ],
    baseAssetAmount: baseAssetAmount,
    orderType: orderType,
  };
  return {
    ...event,
    eventPayload: payloadV2,
    eventVersion: 2,
  };
};

const upcastFillInitRequestEventV2ToV3 = (
  fillInitEventRequestEvent: OrderSwapFillInitRequestEventV2
): OrderSwapFillInitRequestEvent => {
  const {eventPayload, ...restEventV2} = fillInitEventRequestEvent;
  const {baseAssetAmount, orderSwapReferencesWithAmounts, ...restPayloadV2} =
    eventPayload;

  const payloadV3: OrderSwapFillInitRequestEventPayload = {
    ...restPayloadV2,
    orderSwapReferencesWithAmounts: orderSwapReferencesWithAmounts.map(
      ({baseAssetAmount, ...rest}) => ({
        ...rest,
        toAssetAmount: baseAssetAmount.baseAssetAmount,
      })
    ),
    toAssetAmount: baseAssetAmount,
  };
  return {
    ...restEventV2,
    eventPayload: payloadV3,
    eventVersion: 3,
  };
};

const upcastFillInitSuccessEventV1ToV2 = (
  fillInitSuccessEvent: OrderSwapFillInitSuccessEventV1
): OrderSwapFillInitSuccessEventV2 => {
  const {eventPayload, ...event} = fillInitSuccessEvent;
  const {filledOrderSwapUnspentOutputReference, ...payloadV1} = eventPayload;
  const orderSwapFills = {
    filledOrderSwapUnspentOutputReference,
    filledOrderSwapBaseAssetFillAmount: eventPayload.baseAssetAmount,
  };

  const payloadV2: OrderSwapFillInitSuccessEventPayloadV2 = {
    ...payloadV1,
    filledOrderSwapUnspentOutputReferenceWithAmounts: [orderSwapFills],
  };
  return {
    ...event,
    eventPayload: payloadV2,
    eventVersion: 2,
  };
};

const upcastFillInitSuccessEventV2ToV3 = (
  fillInitSuccessEvent: OrderSwapFillInitSuccessEventV2
): OrderSwapFillInitSuccessEvent => {
  const {eventPayload, ...event} = fillInitSuccessEvent;
  const {
    baseAssetId,
    quoteAssetId,
    baseAssetAmount,
    quoteAssetAmount,
    takerQuoteAssetFeeAmount,
    takerQuoteAssetFeePercent,
    filledOrderSwapUnspentOutputReferenceWithAmounts,
    ...restPayloadV2
  } = eventPayload;

  const payloadV3: OrderSwapFillInitSuccessEventPayload = {
    ...restPayloadV2,
    toAssetId: baseAssetId,
    fromAssetId: quoteAssetId,
    toAssetAmount: baseAssetAmount,
    fromAssetAmount: quoteAssetAmount,
    takerFromAssetFeeAmount: takerQuoteAssetFeeAmount,
    takerFromAssetFeePercent: takerQuoteAssetFeePercent,
    filledOrderSwapUnspentOutputReferenceWithAmounts:
      filledOrderSwapUnspentOutputReferenceWithAmounts.map(
        ({filledOrderSwapBaseAssetFillAmount, ...rest}) => ({
          ...rest,
          filledOrderSwapToAssetFillAmount: filledOrderSwapBaseAssetFillAmount,
        })
      ),
  };
  return {
    ...event,
    eventPayload: payloadV3,
    eventVersion: 3,
  };
};

const upcastFillOnChainSuccessEventV1ToV2 = (
  event: OrderSwapFillOnChainSuccessEventV1
): OrderSwapFillOnChainSuccessEvent => {
  const {eventPayload, ...restEventV1} = event;
  const {
    baseAssetId,
    quoteAssetId,
    baseAssetAmount,
    quoteAssetAmount,
    ...restPayloadV1
  } = eventPayload;

  const payloadV2: OrderSwapFillOnChainSuccessEventPayload = {
    ...restPayloadV1,
    toAssetId: baseAssetId,
    fromAssetId: quoteAssetId,
    toAssetAmount: baseAssetAmount,
    fromAssetAmount: quoteAssetAmount,
  };
  return {
    ...restEventV1,
    eventPayload: payloadV2,
    eventVersion: 2,
  };
};

export const upcastFillEvent = (
  event: OrderSwapFillEvent
): OrderSwapFillEvent => {
  switch (event.eventType) {
    case EventTypes.ORDER_SWAP__FILL_INIT__REQUEST: {
      switch (event.eventVersion) {
        case 1:
          return loFp.flow(
            upcastFillInitRequestEventV1ToV2,
            upcastFillEvent
          )(event);
        case 2:
          return loFp.flow(
            upcastFillInitRequestEventV2ToV3,
            upcastFillEvent
          )(event);
        default: {
          const latestVersionEvent: OrderSwapFillInitRequestEvent = event;
          return latestVersionEvent;
        }
      }
    }
    case EventTypes.ORDER_SWAP__FILL_INIT__FAILURE: {
      const latestVersionEvent: OrderSwapFillInitFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS: {
      switch (event.eventVersion) {
        case 1:
          return loFp.flow(
            upcastFillInitSuccessEventV1ToV2,
            upcastFillEvent
          )(event);
        case 2:
          return loFp.flow(
            upcastFillInitSuccessEventV2ToV3,
            upcastFillEvent
          )(event);
        default: {
          const latestVersionEvent: OrderSwapFillInitSuccessEvent = event;
          return latestVersionEvent;
        }
      }
    }
    case EventTypes.ORDER_SWAP__FILL_SUBMIT__FAILURE: {
      const latestVersionEvent: OrderSwapFillSubmitFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__FILL_SUBMIT__SUCCESS: {
      const latestVersionEvent: OrderSwapFillSubmitSuccessEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__FILL_ONCHAIN__FAILURE: {
      const latestVersionEvent: OrderSwapFillOnChainFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS: {
      switch (event.eventVersion) {
        case 1:
          return loFp.flow(
            upcastFillOnChainSuccessEventV1ToV2,
            upcastFillEvent
          )(event);
        default: {
          const latestVersionEvent: OrderSwapFillOnChainSuccessEvent = event;
          return latestVersionEvent;
        }
      }
    }
  }
};
