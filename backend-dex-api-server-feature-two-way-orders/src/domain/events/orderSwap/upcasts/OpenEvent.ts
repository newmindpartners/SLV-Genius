import * as loFp from 'lodash/fp';
import {
  OrderSwapOpenOnChainSuccessEventV1,
  OrderSwapOpenOnChainSuccessEvent,
  OrderSwapOpenOnChainSuccessEventPayload,
  OrderSwapOpenOnChainSuccessEventV2,
  OrderSwapOpenOnChainSuccessEventPayloadV2,
  OrderSwapOpenInitRequestEventV1,
  OrderSwapOpenInitRequestEvent,
  OrderSwapOpenInitSuccessEventV1,
  OrderSwapOpenInitSuccessEventPayload,
  OrderSwapOpenInitSuccessEvent,
  EventTypes,
  OrderSwapOpenInitFailureEvent,
  OrderSwapOpenSubmitFailureEvent,
  OrderSwapOpenSubmitSuccessEvent,
  OrderSwapOpenOnChainFailureEvent,
} from '~/domain/events';
import {OrderSwapOpenInitRequestEventPayload} from '../OrderSwapOpenInitRequestEvent';
import {OrderSwapOpenEvent} from '../OrderSwapOpenEvent';

import {ceil} from 'lodash';
import {div, times} from '~/domain/utils/math.util';

/**
 * This value is used as a substitute to the current maker fee percent which is
 * passed from the Tx server when requesting a swap order transaction.
 * Therefore, this value is subject to change over time and should be updated.
 */
const makerQuoteAssetFeePercent = '0.3';

const getEstimatedMakerFees = (
  quoteAssetAmount: string
): {
  makerLovelaceFlatFeeAmount: string;
  makerQuoteAssetFeeAmount: string;
  makerQuoteAssetFeePercent: string;
} => {
  const makerQuoteAssetFeeAmount = ceil(
    times(quoteAssetAmount, div(makerQuoteAssetFeePercent, 100)),
    0
  );

  return {
    makerLovelaceFlatFeeAmount: '1000000',
    makerQuoteAssetFeeAmount: makerQuoteAssetFeeAmount.toString(),
    makerQuoteAssetFeePercent,
  };
};

const estimatedTakerLovelaceFlatFeeAmount = '1000000';

const upcastOpenInitRequestEventV1ToV2 = (
  event: OrderSwapOpenInitRequestEventV1
): OrderSwapOpenInitRequestEvent => {
  const {eventPayload, ...restEvent} = event;

  const {
    baseAssetId,
    quoteAssetId,
    baseAssetAmount,
    quoteAssetAmount,
    fillQuoteAssetCount,
    ...restPayload
  } = eventPayload;

  const payloadV2: OrderSwapOpenInitRequestEventPayload = {
    ...restPayload,
    toAssetId: baseAssetId,
    fromAssetId: quoteAssetId,
    toAssetAmount: baseAssetAmount,
    fromAssetAmount: quoteAssetAmount,
    fillFromAssetCount: fillQuoteAssetCount,
  };
  return {
    ...restEvent,
    eventPayload: payloadV2,
    eventVersion: 2,
  };
};

const upcastOpenInitSuccessEventV1ToV2 = (
  event: OrderSwapOpenInitSuccessEventV1
): OrderSwapOpenInitSuccessEvent => {
  const {eventPayload, ...restEvent} = event;

  const {makerQuoteAssetFeeAmount, makerQuoteAssetFeePercent, ...restPayload} =
    eventPayload;

  const payloadV2: OrderSwapOpenInitSuccessEventPayload = {
    makerFromAssetFeeAmount: makerQuoteAssetFeeAmount,
    makerFromAssetFeePercent: makerQuoteAssetFeePercent,
    ...restPayload,
  };
  return {
    ...restEvent,
    eventPayload: payloadV2,
    eventVersion: 2,
  };
};

const upcastOpenOnChainSuccessEventV1ToV2 = (
  event: OrderSwapOpenOnChainSuccessEventV1
): OrderSwapOpenOnChainSuccessEventV2 => {
  const {eventPayload, ...rest} = event;

  const estimatedMakerFees = getEstimatedMakerFees(
    eventPayload.quoteAssetAmount
  );

  const estimatedFees: {
    makerLovelaceFlatFeeAmount: string;
    makerQuoteAssetFeeAmount: string;
    makerQuoteAssetFeePercent: string;
    takerLovelaceFlatFeeAmount: string;
  } = {
    ...estimatedMakerFees,
    takerLovelaceFlatFeeAmount: estimatedTakerLovelaceFlatFeeAmount,
  };

  const payloadV2: OrderSwapOpenOnChainSuccessEventPayloadV2 = {
    ...eventPayload,
    ...estimatedFees,
  };
  return {
    ...rest,
    eventPayload: payloadV2,
    eventVersion: 2,
  };
};

const upcastOpenOnChainSuccessEventV2ToV3 = (
  event: OrderSwapOpenOnChainSuccessEventV2
): OrderSwapOpenOnChainSuccessEvent => {
  const {eventPayload, ...restEvent} = event;

  const {
    baseAssetId,
    quoteAssetId,
    baseAssetAmount,
    quoteAssetAmount,
    baseAssetAmountTotalFilled,
    quoteAssetAmountTotalFilled,
    baseAssetAmountTotalRemaining,
    quoteAssetAmountTotalRemaining,
    makerQuoteAssetFeeAmount,
    makerQuoteAssetFeePercent,
    ...restPayload
  } = eventPayload;

  const payloadV3: OrderSwapOpenOnChainSuccessEventPayload = {
    ...restPayload,
    toAssetId: baseAssetId,
    fromAssetId: quoteAssetId,
    toAssetAmount: baseAssetAmount,
    fromAssetAmount: quoteAssetAmount,
    toAssetAmountTotalFilled: baseAssetAmountTotalFilled,
    fromAssetAmountTotalFilled: quoteAssetAmountTotalFilled,
    toAssetAmountTotalRemaining: baseAssetAmountTotalRemaining,
    fromAssetAmountTotalRemaining: quoteAssetAmountTotalRemaining,
    makerFromAssetFeeAmount: makerQuoteAssetFeeAmount,
    makerFromAssetFeePercent: makerQuoteAssetFeePercent,
  };
  return {
    ...restEvent,
    eventPayload: payloadV3,
    eventVersion: 3,
  };
};

export const upcastOpenEvent = (
  event: OrderSwapOpenEvent
): OrderSwapOpenEvent => {
  switch (event.eventType) {
    case EventTypes.ORDER_SWAP__OPEN_INIT__REQUEST: {
      switch (event.eventVersion) {
        case 1:
          return loFp.flow(
            upcastOpenInitRequestEventV1ToV2,
            upcastOpenEvent
          )(event);
        default: {
          const latestVersionEvent: OrderSwapOpenInitRequestEvent = event;
          return latestVersionEvent;
        }
      }
    }
    case EventTypes.ORDER_SWAP__OPEN_INIT__FAILURE: {
      const latestVersionEvent: OrderSwapOpenInitFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__OPEN_INIT__SUCCESS: {
      switch (event.eventVersion) {
        case 1:
          return loFp.flow(
            upcastOpenInitSuccessEventV1ToV2,
            upcastOpenEvent
          )(event);
        default: {
          const latestVersionEvent: OrderSwapOpenInitSuccessEvent = event;
          return latestVersionEvent;
        }
      }
    }
    case EventTypes.ORDER_SWAP__OPEN_SUBMIT__FAILURE: {
      const latestVersionEvent: OrderSwapOpenSubmitFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS: {
      const latestVersionEvent: OrderSwapOpenSubmitSuccessEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE: {
      const latestVersionEvent: OrderSwapOpenOnChainFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS: {
      switch (event.eventVersion) {
        case 1:
          return loFp.flow(
            upcastOpenOnChainSuccessEventV1ToV2,
            upcastOpenEvent
          )(event);
        case 2:
          return loFp.flow(
            upcastOpenOnChainSuccessEventV2ToV3,
            upcastOpenEvent
          )(event);
        default: {
          const latestVersionEvent: OrderSwapOpenOnChainSuccessEvent = event;
          return latestVersionEvent;
        }
      }
    }
  }
};
