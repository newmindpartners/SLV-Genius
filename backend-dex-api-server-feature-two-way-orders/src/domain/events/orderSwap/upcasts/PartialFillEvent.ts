import * as loFp from 'lodash/fp';
import {
  EventTypes,
  OrderSwapPartialFillOnChainFailureEvent,
  OrderSwapPartialFillOnChainSuccessEvent,
  OrderSwapPartialFillOnChainSuccessEventPayload,
  OrderSwapPartialFillOnChainSuccessEventV1,
} from '~/domain/events';
import {OrderSwapPartialFillEvent} from '../OrderSwapPartialFillEvent';

const upcastPartialFillOnChainSuccessEventV1ToV2 = (
  event: OrderSwapPartialFillOnChainSuccessEventV1
): OrderSwapPartialFillOnChainSuccessEvent => {
  const {eventPayload, ...restEvent} = event;

  const {
    baseAssetId,
    quoteAssetId,
    baseAssetAmountTotalFilled,
    quoteAssetAmountTotalFilled,
    baseAssetAmountTotalRemaining,
    quoteAssetAmountTotalRemaining,
    ...restPayload
  } = eventPayload;

  const payloadV2: OrderSwapPartialFillOnChainSuccessEventPayload = {
    ...restPayload,
    toAssetId: baseAssetId,
    fromAssetId: quoteAssetId,
    toAssetAmountTotalFilled: baseAssetAmountTotalFilled,
    fromAssetAmountTotalFilled: quoteAssetAmountTotalFilled,
    toAssetAmountTotalRemaining: baseAssetAmountTotalRemaining,
    fromAssetAmountTotalRemaining: quoteAssetAmountTotalRemaining,
  };

  return {
    ...restEvent,
    eventPayload: payloadV2,
    eventVersion: 2,
  };
};

export const upcastPartialFillEvent = (
  event: OrderSwapPartialFillEvent
): OrderSwapPartialFillEvent => {
  switch (event.eventType) {
    case EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE: {
      const latestVersionEvent: OrderSwapPartialFillOnChainFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS: {
      switch (event.eventVersion) {
        case 1:
          return loFp.flow(
            upcastPartialFillOnChainSuccessEventV1ToV2,
            upcastPartialFillEvent
          )(event);
        default: {
          const latestVersionEvent: OrderSwapPartialFillOnChainSuccessEvent =
            event;
          return latestVersionEvent;
        }
      }
    }
  }
};
