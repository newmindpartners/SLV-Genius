import {
  DomainEventMinimal,
  DomainEventTransaction,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import {find} from 'lodash';

import * as Private from '~/domain/models/private';

import {ErrorCode} from '~/domain/errors';
import {DeepRequired} from '~/implementation/utils/typescript';
import {OrderSwapEvent} from './OrderSwapEvent';

/**
 * Old version of the event, should not be referenced in application code!
 * Only kept around for upcasting purposes.
 */
export type OrderSwapFillInitSuccessEventPayloadV1 = {
  transactionFeeAmount: string;
  baseAssetId: string;
  quoteAssetId: string;
  baseAssetAmount: string;
  quoteAssetAmount: string;
  price: number;
  priceNumerator: string | null;
  priceDenominator: string | null;
  takerLovelaceFlatFeeAmount: string;
  takerQuoteAssetFeeAmount: string;
  takerQuoteAssetFeePercent: string;
  userId: string;
  filledOrderSwapUnspentOutputReference: {
    filledOrderSwapUtxoReferenceIndex: number;
    filledOrderSwapUtxoReferenceTransactionHash: string;
  };
  filledOrderSwapUnspentOutputReferenceWithAmounts: {
    filledOrderSwapUnspentOutputReference: {
      filledOrderSwapUtxoReferenceIndex: number;
      filledOrderSwapUtxoReferenceTransactionHash: string;
    };
    filledOrderSwapBaseAssetFillAmount: string;
  }[];
};

export type OrderSwapFillInitSuccessEventV1 = DomainEventTransaction<
  OrderSwapFillInitSuccessEventPayloadV1,
  typeof eventType,
  1
>;

export type OrderSwapFillInitSuccessEventPayloadV2 = {
  userId: string;
  transactionFeeAmount: string;
  baseAssetId: string;
  quoteAssetId: string;
  baseAssetAmount: string;
  quoteAssetAmount: string;
  price: number;
  priceNumerator: string | null;
  priceDenominator: string | null;
  takerLovelaceFlatFeeAmount: string;
  takerQuoteAssetFeeAmount: string;
  takerQuoteAssetFeePercent: string;
  filledOrderSwapUnspentOutputReferenceWithAmounts: {
    filledOrderSwapUnspentOutputReference: {
      filledOrderSwapUtxoReferenceIndex: number;
      filledOrderSwapUtxoReferenceTransactionHash: string;
    };
    filledOrderSwapBaseAssetFillAmount: string;
  }[];
};

export type OrderSwapFillInitSuccessEventV2 = DomainEventTransaction<
  OrderSwapFillInitSuccessEventPayloadV2,
  typeof eventType,
  2
>;
/*********************************************************/

// TODO user should not be null
export type OrderSwapFillInitSuccessEventPayload = DeepRequired<
  Pick<
    Private.OrderSwapOpenAndPartialFillBase,
    | 'userId'
    | 'transactionFeeAmount'
    | 'toAssetId'
    | 'fromAssetId'
    | 'toAssetAmount'
    | 'fromAssetAmount'
    | 'price'
    | 'priceNumerator'
    | 'priceDenominator'
    | 'takerLovelaceFlatFeeAmount'
  > &
    Pick<
      Private.OrderSwapFillBase,
      | 'takerFromAssetFeeAmount'
      | 'takerFromAssetFeePercent'
      | 'filledOrderSwapUnspentOutputReferenceWithAmounts'
    >,
  ['userId']
>;

export type OrderSwapFillInitSuccessEvent = DomainEventTransaction<
  OrderSwapFillInitSuccessEventPayload,
  typeof eventType,
  typeof fillInitSuccessEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__FILL_INIT__SUCCESS;

export const fillInitSuccessEventVersion = 3;

export function isOrderSwapFillInitSuccessEvent(
  event: OrderSwapEvent
): event is OrderSwapFillInitSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === fillInitSuccessEventVersion &&
    isDomainEventTransaction(event)
  );
}

export function getOrderSwapFillInitSuccessEvent(
  orderSwapEvents: OrderSwapEvent[]
): OrderSwapFillInitSuccessEvent | undefined {
  return find(orderSwapEvents, isOrderSwapFillInitSuccessEvent);
}

export function getOrderSwapFillInitSuccessEventOrThrow(
  orderSwapEvents: OrderSwapEvent[]
): OrderSwapFillInitSuccessEvent {
  const orderSwapInitSuccessEvent =
    getOrderSwapFillInitSuccessEvent(orderSwapEvents);

  if (orderSwapInitSuccessEvent) {
    return orderSwapInitSuccessEvent;
  } else {
    throw Error(ErrorCode.ORDER__EVENT_NOT_FOUND);
  }
}
