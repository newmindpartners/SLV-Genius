// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';
import {isEqual} from 'lodash';
import {
  EventTypes,
  isOrderSwapFinalFillOnChainSuccessEvent,
  OrderSwapFinalFillOnChainSuccessEvent,
  OrderSwapFinalFillOnChainSuccessEventV1,
} from '~/domain/events';
import {upcastOrderSwapEvent} from '~/domain/events/orderSwap/upcasts';

test('Upcasting of ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS V1 to latest is correct', () => {
  const oldVersionEvent = createMock<OrderSwapFinalFillOnChainSuccessEventV1>({
    eventType: EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS,
    eventVersion: 1,
    eventPayload: {
      baseAssetId: 'baseToAssetId',
      quoteAssetId: 'quoteFromAssetId',
      baseAssetAmountTotalFilled: 'baseToAssetAmountTotalFilled',
      quoteAssetAmountTotalFilled: 'quoteFromAssetAmountTotalFilled',
      baseAssetAmountTotalRemaining: 'baseToAssetAmountTotalRemaining',
      quoteAssetAmountTotalRemaining: 'quoteFromAssetAmountTotalRemaining',
    },
    transactionHash: 'transactionhash1234',
    blockHash: 'blockhash1234',
    blockSlot: 1n,
  });

  const latestVersionEvent = createMock<OrderSwapFinalFillOnChainSuccessEvent>({
    eventType: EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS,
    eventVersion: 2,
    eventPayload: {
      toAssetId: 'baseToAssetId',
      fromAssetId: 'quoteFromAssetId',
      toAssetAmountTotalFilled: 'baseToAssetAmountTotalFilled',
      fromAssetAmountTotalFilled: 'quoteFromAssetAmountTotalFilled',
      toAssetAmountTotalRemaining: 'baseToAssetAmountTotalRemaining',
      fromAssetAmountTotalRemaining: 'quoteFromAssetAmountTotalRemaining',
    },
    transactionHash: 'transactionhash1234',
    blockHash: 'blockhash1234',
    blockSlot: 1n,
  });

  const upcastedOldVersion = upcastOrderSwapEvent(oldVersionEvent);
  const upcastedLatestVersion = upcastOrderSwapEvent(latestVersionEvent);

  const isUpcastingCorrect =
    /**
     * Check that event no longer uses `base` and `quote` terminology and that the values
     * remain unchanged.
     */
    isEqual(
      upcastedOldVersion.eventPayload,
      upcastedLatestVersion.eventPayload
    ) &&
    /**
     * Checking that all upcasted events, regardless of their `eventVersion`, is of
     * the same correct type
     */
    isOrderSwapFinalFillOnChainSuccessEvent(upcastedOldVersion) &&
    isOrderSwapFinalFillOnChainSuccessEvent(upcastedLatestVersion);

  expect(isUpcastingCorrect).toBeTruthy();
});
