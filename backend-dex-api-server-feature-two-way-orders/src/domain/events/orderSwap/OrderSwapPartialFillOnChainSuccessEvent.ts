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
export type OrderSwapPartialFillOnChainSuccessEventPayloadV1 = {
  userId: string | null;
  transactionFeeAmount: string;
  orderType: 'LIMIT';
  baseAssetId: string;
  quoteAssetId: string;
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

export type OrderSwapPartialFillOnChainSuccessEventV1 =
  DomainEventTransactionOnChain<
    OrderSwapPartialFillOnChainSuccessEventPayloadV1,
    typeof eventType,
    1
  >;
/*********************************************************/

export type OrderSwapPartialFillOnChainSuccessEventPayload = Pick<
  Private.OrderSwapOpenAndPartialFillBase,
  | 'userId'
  | 'transactionFeeAmount'
  | 'transactionTimestamp'
  | 'orderType'
  | 'toAssetId'
  | 'fromAssetId'
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
>;

export type OrderSwapPartialFillOnChainSuccessEvent =
  DomainEventTransactionOnChain<
    OrderSwapPartialFillOnChainSuccessEventPayload,
    typeof eventType,
    typeof partialFillOnChainSuccessEventVersion
  >;

const eventType = EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS;

export const partialFillOnChainSuccessEventVersion = 2;

export function isOrderSwapPartialFillOnChainSuccessEvent(
  event: DomainEvent
): event is OrderSwapPartialFillOnChainSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === partialFillOnChainSuccessEventVersion &&
    /**
     * This is a temporary fix to handle the fact that some old events
     * of this type were created with block_hash and block_slot set to null.
     * Unless we relax this check, we can't process these events, which result in
     * projection errors stopping new events from being processed.
     */
    isDomainEventTransaction(event)
  );
}
