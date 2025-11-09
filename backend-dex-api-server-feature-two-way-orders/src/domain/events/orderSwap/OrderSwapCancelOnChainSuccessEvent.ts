import * as Private from '~/domain/models/private';

import {UserReference} from '~/domain/models/private';
import {Nullable} from '~/implementation/utils/typescript';
import {
  DomainEvent,
  DomainEventTransactionOnChain,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

/**
 * Old version of the event, should not be referenced in application code!
 * Only kept around for upcasting purposes.
 */
export type OrderSwapCancelOnChainSuccessEventPayloadV1 = {
  userId: string | null;
  orderSwapId: string;
  transactionTimestamp: number;
};

export type OrderSwapCancelOnChainSuccessEventV1 =
  DomainEventTransactionOnChain<
    OrderSwapCancelOnChainSuccessEventPayloadV1,
    typeof eventType,
    1
  >;
/*********************************************************/

export type OrderSwapCancelOnChainSuccessEventPayload =
  Nullable<UserReference> &
    Private.OrderSwapReference &
    Private.TransactionTimestamp &
    Private.TransactionFee;

export type OrderSwapCancelOnChainSuccessEvent = DomainEventTransactionOnChain<
  OrderSwapCancelOnChainSuccessEventPayload,
  typeof eventType,
  typeof cancelOnChainSuccessEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS;

export const cancelOnChainSuccessEventVersion = 2;

export function isOrderSwapCancelOnChainSuccessEvent(
  event: DomainEvent
): event is OrderSwapCancelOnChainSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === cancelOnChainSuccessEventVersion &&
    /**
     * This is a temporary fix to handle the fact that some old events
     * of this type were created with block_hash and block_slot set to null.
     * Unless we relax this check, we can't process these events, which result in
     * projection errors stopping new events from being processed.
     */
    isDomainEventTransaction(event)
  );
}
