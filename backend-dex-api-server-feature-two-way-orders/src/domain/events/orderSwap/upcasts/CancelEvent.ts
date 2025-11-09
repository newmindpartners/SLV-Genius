import * as loFp from 'lodash/fp';
import * as Private from '~/domain/models/private';
import {
  OrderSwapCancelOnChainSuccessEventV1,
  OrderSwapCancelOnChainSuccessEvent,
  OrderSwapCancelOnChainSuccessEventPayload,
  EventTypes,
  OrderSwapCancelInitRequestEvent,
  OrderSwapCancelInitFailureEvent,
  OrderSwapCancelInitSuccessEvent,
  OrderSwapCancelSubmitFailureEvent,
  OrderSwapCancelSubmitSuccessEvent,
  OrderSwapCancelOnChainFailureEvent,
} from '~/domain/events';
import {OrderSwapCancelEvent} from '../OrderSwapCancelEvent';

/**
 * This is the average of the TX_FEE calculations made in the below issues
 * https://github.com/geniusyield/dex-api-server/issues/2224
 * https://github.com/geniusyield/dex-api-server/issues/2227
 * which is the closest approximation we could get to how much a swap order
 * transaction on average cost to cancel.
 */
export const estimatedCancellationTransactionLovelaceFeeAmount = '342407';

const upcastCancelOnChainSuccessEventV1ToV2 = (
  event: OrderSwapCancelOnChainSuccessEventV1
): OrderSwapCancelOnChainSuccessEvent => {
  const {eventPayload, ...rest} = event;

  const estimatedFees: Private.TransactionFee = {
    transactionFeeAmount: estimatedCancellationTransactionLovelaceFeeAmount,
  };

  const payloadV2: OrderSwapCancelOnChainSuccessEventPayload = {
    ...eventPayload,
    ...estimatedFees,
  };
  return {
    ...rest,
    eventPayload: payloadV2,
    eventVersion: 2,
  };
};

export const upcastCancelEvent = (
  event: OrderSwapCancelEvent
): OrderSwapCancelEvent => {
  switch (event.eventType) {
    case EventTypes.ORDER_SWAP__CANCEL_INIT__REQUEST: {
      const latestVersionEvent: OrderSwapCancelInitRequestEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__CANCEL_INIT__FAILURE: {
      const latestVersionEvent: OrderSwapCancelInitFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS: {
      const latestVersionEvent: OrderSwapCancelInitSuccessEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__CANCEL_SUBMIT__FAILURE: {
      const latestVersionEvent: OrderSwapCancelSubmitFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__CANCEL_SUBMIT__SUCCESS: {
      const latestVersionEvent: OrderSwapCancelSubmitSuccessEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE: {
      const latestVersionEvent: OrderSwapCancelOnChainFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS: {
      switch (event.eventVersion) {
        case 1:
          return loFp.flow(
            upcastCancelOnChainSuccessEventV1ToV2,
            upcastCancelEvent
          )(event);
        default: {
          const latestVersionEvent: OrderSwapCancelOnChainSuccessEvent = event;
          return latestVersionEvent;
        }
      }
    }
  }
};
