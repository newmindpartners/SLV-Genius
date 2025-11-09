import * as loFp from 'lodash/fp';
import {EventTypes} from '../../EventTypes';
import {OrderSwapFinalFillEvent} from '../OrderSwapFinalFillEvent';
import {OrderSwapFinalFillOnChainFailureEvent} from '../OrderSwapFinalFillOnChainFailureEvent';
import {
  OrderSwapFinalFillOnChainSuccessEvent,
  OrderSwapFinalFillOnChainSuccessEventPayload,
  OrderSwapFinalFillOnChainSuccessEventV1,
} from '../OrderSwapFinalFillOnChainSuccessEvent';

const upcastFinalFillOnChainSuccessEventV1ToV2 = (
  event: OrderSwapFinalFillOnChainSuccessEventV1
): OrderSwapFinalFillOnChainSuccessEvent => {
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

  const payloadV2: OrderSwapFinalFillOnChainSuccessEventPayload = {
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

export const upcastFinalFillEvent = (
  event: OrderSwapFinalFillEvent
): OrderSwapFinalFillEvent => {
  switch (event.eventType) {
    case EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE: {
      const latestVersionEvent: OrderSwapFinalFillOnChainFailureEvent = event;
      return latestVersionEvent;
    }
    case EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS: {
      switch (event.eventVersion) {
        case 1:
          return loFp.flow(
            upcastFinalFillOnChainSuccessEventV1ToV2,
            upcastFinalFillEvent
          )(event);
        default: {
          const latestVersionEvent: OrderSwapFinalFillOnChainSuccessEvent =
            event;
          return latestVersionEvent;
        }
      }
    }
  }
};
