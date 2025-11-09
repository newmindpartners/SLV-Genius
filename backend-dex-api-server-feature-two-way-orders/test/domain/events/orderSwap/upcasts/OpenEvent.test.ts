// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';
import {isEqual} from 'lodash';
import {
  EventTypes,
  isOrderSwapOpenOnChainSuccessEvent,
  OrderSwapOpenOnChainSuccessEvent,
  OrderSwapOpenOnChainSuccessEventV1,
  OrderSwapOpenOnChainSuccessEventV2,
} from '~/domain/events';
import {upcastOrderSwapEvent} from '~/domain/events/orderSwap/upcasts';

test('Upcasting of OrderSwapOpenOnChainSuccessEvent V1 to V2 is correct', () => {
  const eventV1 = createMock<OrderSwapOpenOnChainSuccessEventV1>({
    eventType: EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS,
    eventVersion: 1,
  });
  const eventV2 = createMock<OrderSwapOpenOnChainSuccessEventV2>({
    eventType: EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS,
    eventVersion: 2,
  });

  const upcastedFromV1 = upcastOrderSwapEvent(eventV1);
  const upcastedFromV2 = upcastOrderSwapEvent(eventV2);

  const isUpcastingCorrect =
    /**
     * Checking that all upcasted events, regardless of their `eventVersion`, is of
     * the same correct type
     */
    isOrderSwapOpenOnChainSuccessEvent(upcastedFromV1) &&
    isOrderSwapOpenOnChainSuccessEvent(upcastedFromV2);

  expect(isUpcastingCorrect).toBeTruthy();
});

test('Upcasting of OrderSwapOpenOnChainSuccessEvent V2 to latest is correct', () => {
  const eventV2 = createMock<OrderSwapOpenOnChainSuccessEventV2>({
    eventType: EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS,
    eventVersion: 2,
    eventPayload: {
      baseAssetId: 'baseToAssetId',
      quoteAssetId: 'quoteFromAssetId',
      baseAssetAmount: 'baseToAssetAmount',
      quoteAssetAmount: 'quoteFromAssetAmount',
      baseAssetAmountTotalFilled: 'baseToAssetAmountTotalFilled',
      quoteAssetAmountTotalFilled: 'quoteFromAssetAmountTotalFilled',
      baseAssetAmountTotalRemaining: 'baseToAssetAmountTotalRemaining',
      quoteAssetAmountTotalRemaining: 'quoteFromAssetAmountTotalRemaining',
      makerQuoteAssetFeeAmount: 'makerFromAssetFeeAmount',
      makerQuoteAssetFeePercent: 'makerFromAssetFeePercent',
    },
  });
  const eventV3 = createMock<OrderSwapOpenOnChainSuccessEvent>({
    eventType: EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS,
    eventVersion: 3,
    eventPayload: {
      toAssetId: 'baseToAssetId',
      fromAssetId: 'quoteFromAssetId',
      toAssetAmount: 'baseToAssetAmount',
      fromAssetAmount: 'quoteFromAssetAmount',
      toAssetAmountTotalFilled: 'baseToAssetAmountTotalFilled',
      fromAssetAmountTotalFilled: 'quoteFromAssetAmountTotalFilled',
      toAssetAmountTotalRemaining: 'baseToAssetAmountTotalRemaining',
      fromAssetAmountTotalRemaining: 'quoteFromAssetAmountTotalRemaining',
      makerFromAssetFeeAmount: 'makerFromAssetFeeAmount',
      makerFromAssetFeePercent: 'makerFromAssetFeePercent',
    },
  });

  const upcastedFromV2 = upcastOrderSwapEvent(eventV2);
  const upcastedFromV3 = upcastOrderSwapEvent(eventV3);

  const isUpcastingCorrect =
    /**
     * Check that event no longer uses `base` and `quote` terminology and that the values
     * remain unchanged.
     */
    isEqual(upcastedFromV2.eventPayload, upcastedFromV3.eventPayload) &&
    /**
     * Checking that all upcasted events, regardless of their `eventVersion`, is of
     * the same correct type
     */
    isOrderSwapOpenOnChainSuccessEvent(upcastedFromV2) &&
    isOrderSwapOpenOnChainSuccessEvent(upcastedFromV3);

  expect(isUpcastingCorrect).toBeTruthy();
});
