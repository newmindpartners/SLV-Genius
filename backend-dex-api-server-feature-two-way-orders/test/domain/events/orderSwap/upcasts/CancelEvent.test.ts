// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';
import {isEqual} from 'lodash';
import {
  EventTypes,
  isOrderSwapCancelOnChainSuccessEvent,
  OrderSwapCancelOnChainSuccessEvent,
  OrderSwapCancelOnChainSuccessEventV1,
} from '~/domain/events';
import {upcastOrderSwapEvent} from '~/domain/events/orderSwap/upcasts';
import {estimatedCancellationTransactionLovelaceFeeAmount} from '~/domain/events/orderSwap/upcasts/CancelEvent';

test('Upcasting of OrderSwapCancelOnChainSuccessEvent V1 to latest is correct', () => {
  const eventV1 = createMock<OrderSwapCancelOnChainSuccessEventV1>({
    eventType: EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS,
    eventVersion: 1,
  });
  const eventV2 = createMock<OrderSwapCancelOnChainSuccessEvent>({
    eventType: EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS,
    eventVersion: 2,
    eventPayload: {
      transactionFeeAmount: estimatedCancellationTransactionLovelaceFeeAmount,
    },
  });

  const upcastedFromV1 = upcastOrderSwapEvent(eventV1);
  const upcastedFromV2 = upcastOrderSwapEvent(eventV2);

  const isUpcastingCorrect =
    /**
     * Check that event no longer uses `base` and `quote` terminology and that the values
     * remain unchanged.
     */
    isEqual(upcastedFromV1.eventPayload, upcastedFromV2.eventPayload) &&
    /**
     * Checking that all upcasted events, regardless of their `eventVersion`, is of
     * the same correct type
     */
    isOrderSwapCancelOnChainSuccessEvent(upcastedFromV1) &&
    isOrderSwapCancelOnChainSuccessEvent(upcastedFromV2);

  expect(isUpcastingCorrect).toBeTruthy();
});
