import {
  DomainEvent,
  DomainEventMinimal,
  DomainEventTransactionOnChain,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

/**
 * Old version of the event, should not be referenced in application code!
 * Only kept around for upcasting purposes.
 */

export type OrderSwapFinalFillOnChainSuccessEventPayloadV1 = {
  userId: string | null;
  transactionFeeAmount: string;
  orderType: 'LIMIT';
  baseAssetId: string;
  quoteAssetId: string;
  baseAssetAmountTotalFilled: string;
  quoteAssetAmountTotalFilled: string;
  baseAssetAmountTotalRemaining: string;
  quoteAssetAmountTotalRemaining: string;
  price: number;
  mintAssetId: string;
  partialFillCount: number;
  priceNumerator: string | null;
  priceDenominator: string | null;
  transactionTimestamp: number;
};

export type OrderSwapFinalFillOnChainSuccessEventV1 =
  DomainEventTransactionOnChain<
    OrderSwapFinalFillOnChainSuccessEventPayloadV1,
    typeof eventType,
    1
  >;
/*********************************************************/

export type OrderSwapFinalFillOnChainSuccessEventPayload = Pick<
  Private.OrderSwapOpenAndPartialFillBase,
  | 'userId'
  | 'transactionFeeAmount'
  | 'orderType'
  | 'toAssetId'
  | 'fromAssetId'
  | 'toAssetAmountTotalFilled'
  | 'fromAssetAmountTotalFilled'
  | 'toAssetAmountTotalRemaining'
  | 'fromAssetAmountTotalRemaining'
  | 'price'
  | 'mintAssetId'
  | 'partialFillCount'
  | 'priceNumerator'
  | 'priceDenominator'
  | 'transactionTimestamp'
>;

export type OrderSwapFinalFillOnChainSuccessEvent =
  DomainEventTransactionOnChain<
    OrderSwapFinalFillOnChainSuccessEventPayload,
    typeof eventType,
    typeof finalFillOnChainSuccessEventVersion
  >;

const eventType = EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS;

export const finalFillOnChainSuccessEventVersion = 2;

export function isOrderSwapFinalFillOnChainSuccessEvent(
  event: DomainEvent
): event is OrderSwapFinalFillOnChainSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === finalFillOnChainSuccessEventVersion &&
    /**
     * This is a temporary fix to handle the fact that some old events
     * of this type were created with block_hash and block_slot set to null.
     * Unless we relax this check, we can't process these events, which result in
     * projection errors stopping new events from being processed.
     */
    isDomainEventTransaction(event)
  );
}
