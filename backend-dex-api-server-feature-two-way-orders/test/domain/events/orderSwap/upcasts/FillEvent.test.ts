// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';
import {isEqual} from 'lodash';
import {
  EventTypes,
  isOrderSwapFillInitRequestEvent,
  isOrderSwapFillInitSuccessEvent,
  isOrderSwapFillOnChainSuccessEvent,
  OrderSwapFillInitRequestEvent,
  OrderSwapFillInitRequestEventV1,
  OrderSwapFillInitSuccessEvent,
  OrderSwapFillInitSuccessEventV1,
  OrderSwapFillOnChainSuccessEvent,
  OrderSwapFillOnChainSuccessEventV1,
} from '~/domain/events';
import {upcastOrderSwapEvent} from '~/domain/events/orderSwap/upcasts';

test('Upcasting of ORDER_SWAP__FILL_INIT__REQUEST V1 to latest is correct', () => {
  const orderId = 'd52a4881-3a25-45f4-9298-c751c1e43efc';
  const baseAssetAmount = '100000000';

  const fillInitRequestEventV1 = createMock<OrderSwapFillInitRequestEventV1>({
    eventType: EventTypes.ORDER_SWAP__FILL_INIT__REQUEST,
    eventPayload: {
      baseAssetAmount,
      orderId,
    },
    eventVersion: 1,
  });
  const fillInitRequestEventV3 = createMock<OrderSwapFillInitRequestEvent>({
    eventType: EventTypes.ORDER_SWAP__FILL_INIT__REQUEST,
    eventPayload: {
      toAssetAmount: '100000000',
      orderSwapReferencesWithAmounts: [
        {orderReference: {orderId}, toAssetAmount: baseAssetAmount},
      ],
    },
    eventVersion: 3,
  });

  const upcastedFromV1 = upcastOrderSwapEvent(fillInitRequestEventV1);
  const upcastedFromV3 = upcastOrderSwapEvent(fillInitRequestEventV3);

  const isUpcastingCorrect =
    /**
     * Check that event no longer uses `base` and `quote` terminology and that the values
     * remain unchanged.
     */
    isEqual(upcastedFromV1.eventPayload, upcastedFromV3.eventPayload) &&
    /**
     * Checking that all upcasted events, regardless of their `eventVersion`, is of
     * the same correct type
     */
    isOrderSwapFillInitRequestEvent(upcastedFromV1) &&
    isOrderSwapFillInitRequestEvent(upcastedFromV3);

  expect(isUpcastingCorrect).toBeTruthy();
});

test('Upcasting of ORDER_SWAP__FILL_INIT__SUCCESS V1 to latest is correct', () => {
  /**
   * These are needed because the upcasting from v1 -> v2 -> v3 at some point add them
   * to the v1 event payload, and without them the deep isEqual check will fail.
   */
  const partialEventPayload = {
    userId: '3f5c1426-8ef2-44b1-9a1e-3c557d887092',
    transactionFeeAmount: '123456',
    price: 1.2345,
    priceNumerator: '3',
    priceDenominator: '5',
    takerLovelaceFlatFeeAmount: '345678',
  } as const;

  const fillInitSuccessEventV1 = createMock<OrderSwapFillInitSuccessEventV1>({
    eventType: EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS,
    eventPayload: {
      ...partialEventPayload,
      baseAssetId: 'baseToAssetId',
      quoteAssetId: 'quoteFromAssetId',
      baseAssetAmount: 'baseToAssetAmount',
      quoteAssetAmount: 'quoteFromAssetAmount',
      takerQuoteAssetFeeAmount: 'takerQuoteFromAssetFeeAmount',
      takerQuoteAssetFeePercent: 'takerQuoteFromAssetFeePercent',
      filledOrderSwapUnspentOutputReference: {
        filledOrderSwapUtxoReferenceIndex: 0,
        filledOrderSwapUtxoReferenceTransactionHash: 'utxoRef',
      },
    },
    eventVersion: 1,
  });
  const fillInitSuccessEventV3 = createMock<OrderSwapFillInitSuccessEvent>({
    eventType: EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS,
    eventPayload: {
      ...partialEventPayload,
      toAssetId: 'baseToAssetId',
      fromAssetId: 'quoteFromAssetId',
      toAssetAmount: 'baseToAssetAmount',
      fromAssetAmount: 'quoteFromAssetAmount',
      takerFromAssetFeeAmount: 'takerQuoteFromAssetFeeAmount',
      takerFromAssetFeePercent: 'takerQuoteFromAssetFeePercent',
      filledOrderSwapUnspentOutputReferenceWithAmounts: [
        {
          filledOrderSwapUnspentOutputReference: {
            filledOrderSwapUtxoReferenceIndex: 0,
            filledOrderSwapUtxoReferenceTransactionHash: 'utxoRef',
          },
          filledOrderSwapToAssetFillAmount: 'baseToAssetAmount',
        },
      ],
    },
    eventVersion: 3,
  });

  const upcastedFromV1 = upcastOrderSwapEvent(
    fillInitSuccessEventV1
  ) as OrderSwapFillInitSuccessEvent;
  const upcastedFromV3 = upcastOrderSwapEvent(
    fillInitSuccessEventV3
  ) as OrderSwapFillInitSuccessEvent;

  /**
   * Check that event no longer uses `base` and `quote` terminology and that the values
   * remain unchanged.
   */
  expect(
    isEqual(upcastedFromV1.eventPayload, upcastedFromV3.eventPayload)
  ).toBeTruthy();

  /**
   * Checking that all upcasted events, regardless of their `eventVersion`, is of
   * the same correct type
   */
  expect(
    isOrderSwapFillInitSuccessEvent(upcastedFromV1) &&
      isOrderSwapFillInitSuccessEvent(upcastedFromV3)
  ).toBeTruthy();
});

test('Upcasting of ORDER_SWAP__FILL_ONCHAIN__SUCCESS V1 to latest is correct', () => {
  const eventV1 = createMock<OrderSwapFillOnChainSuccessEventV1>({
    eventType: EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS,
    eventPayload: {
      baseAssetId: 'baseToAssetId',
      quoteAssetId: 'quoteFromAssetId',
      baseAssetAmount: 'baseToAssetAmount',
      quoteAssetAmount: 'quoteFromAssetAmount',
    },
    eventVersion: 1,
  });
  const eventV2 = createMock<OrderSwapFillOnChainSuccessEvent>({
    eventType: EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS,
    eventPayload: {
      toAssetId: 'baseToAssetId',
      fromAssetId: 'quoteFromAssetId',
      toAssetAmount: 'baseToAssetAmount',
      fromAssetAmount: 'quoteFromAssetAmount',
    },
    eventVersion: 2,
  });

  const upcastedFromV1 = upcastOrderSwapEvent(eventV1);
  const upcastedFromV2 = upcastOrderSwapEvent(eventV2);

  /**
   * Check that event no longer uses `base` and `quote` terminology and that the values
   * remain unchanged.
   */
  expect(
    isEqual(upcastedFromV1.eventPayload, upcastedFromV2.eventPayload)
  ).toBeTruthy();

  /**
   * Checking that all upcasted events, regardless of their `eventVersion`, is of
   * the same correct type
   */
  expect(
    isOrderSwapFillOnChainSuccessEvent(upcastedFromV1) &&
      isOrderSwapFillOnChainSuccessEvent(upcastedFromV2)
  ).toBeTruthy();
});
