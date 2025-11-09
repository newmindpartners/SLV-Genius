import {
  DomainEvent,
  DomainEventTransactionOnChain,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

/**
 * Old version of the event, should not be referenced in application code!
 * Only kept around for upcasting purposes.
 */
export type OrderSwapOpenOnChainSuccessEventPayloadV1 = {
  userId: string | null;
  transactionFeeAmount: string;
  orderType: 'LIMIT';
  baseAssetId: string;
  quoteAssetId: string;
  baseAssetAmount: string;
  quoteAssetAmount: string;
  effectiveFromDate: Date | null;
  effectiveUntilDate: Date | null;
  baseAssetAmountTotalFilled: string;
  quoteAssetAmountTotalFilled: string;
  baseAssetAmountTotalRemaining: string;
  quoteAssetAmountTotalRemaining: string;
  price: number;
  priceNumerator: string;
  priceDenominator: string;
  utxoReferenceTransactionHash: string;
  utxoReferenceIndex: number;
  mintAssetId: string;
  partialFillCount: number;
  transactionTimestamp: number;
};

export type OrderSwapOpenOnChainSuccessEventV1 = DomainEventTransactionOnChain<
  OrderSwapOpenOnChainSuccessEventPayloadV1,
  typeof eventType,
  1
>;

export type OrderSwapOpenOnChainSuccessEventPayloadV2 = {
  userId: string | null;
  transactionFeeAmount: string;
  orderType: 'LIMIT';
  baseAssetId: string;
  quoteAssetId: string;
  baseAssetAmount: string;
  quoteAssetAmount: string;
  effectiveFromDate: Date | null;
  effectiveUntilDate: Date | null;
  baseAssetAmountTotalFilled: string;
  quoteAssetAmountTotalFilled: string;
  baseAssetAmountTotalRemaining: string;
  quoteAssetAmountTotalRemaining: string;
  price: number;
  priceNumerator: string;
  priceDenominator: string;
  utxoReferenceTransactionHash: string;
  utxoReferenceIndex: number;
  mintAssetId: string;
  partialFillCount: number;
  makerLovelaceFlatFeeAmount: string;
  makerQuoteAssetFeeAmount: string;
  makerQuoteAssetFeePercent: string;
  takerLovelaceFlatFeeAmount: string;
  transactionTimestamp: number;
};

export type OrderSwapOpenOnChainSuccessEventV2 = DomainEventTransactionOnChain<
  OrderSwapOpenOnChainSuccessEventPayloadV2,
  typeof eventType,
  2
>;

/*********************************************************/

export type OrderSwapOpenOnChainSuccessEventPayload = Pick<
  Private.OrderSwapOpenAndPartialFillBase,
  | 'userId'
  | 'transactionFeeAmount'
  | 'transactionTimestamp'
  | 'orderType'
  | 'toAssetId'
  | 'fromAssetId'
  | 'toAssetAmount'
  | 'fromAssetAmount'
  | 'effectiveFromDate'
  | 'effectiveUntilDate'
  | 'toAssetAmountTotalFilled'
  | 'fromAssetAmountTotalFilled'
  | 'toAssetAmountTotalRemaining'
  | 'fromAssetAmountTotalRemaining'
  | 'price'
  | 'priceNumerator'
  | 'priceDenominator'
  | 'utxoReferenceTransactionHash'
  | 'utxoReferenceIndex'
  | 'mintAssetId'
  | 'partialFillCount'
  | 'makerLovelaceFlatFeeAmount'
  | 'makerFromAssetFeeAmount'
  | 'makerFromAssetFeePercent'
  | 'takerLovelaceFlatFeeAmount'
>;

export type OrderSwapOpenOnChainSuccessEvent = DomainEventTransactionOnChain<
  OrderSwapOpenOnChainSuccessEventPayload,
  typeof eventType,
  typeof openOnChainSuccessEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__OPEN_ONCHAIN__SUCCESS;

export const openOnChainSuccessEventVersion = 3;

export function isOrderSwapOpenOnChainSuccessEvent(
  event: DomainEvent
): event is OrderSwapOpenOnChainSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === openOnChainSuccessEventVersion &&
    /**
     * This is a temporary fix to handle the fact that some old events
     * of this type were created with block_hash and block_slot set to null.
     * Unless we relax this check, we can't process these events, which result in
     * projection errors stopping new events from being processed.
     */
    isDomainEventTransaction(event)
  );
}
