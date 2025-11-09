import {
  DomainEvent,
  DomainEventTransactionOnChain,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';
import {DeepRequired} from '~/implementation/utils/typescript';

import * as Private from '~/domain/models/private';

/**
 * Old version of the event, should not be referenced in application code!
 * Only kept around for upcasting purposes.
 */

export type OrderSwapFillOnChainSuccessEventPayloadV1 = {
  userId: string;
  baseAssetId: string;
  quoteAssetId: string;
  baseAssetAmount: string;
  quoteAssetAmount: string;
  price: number;
  priceNumerator: string | null;
  priceDenominator: string | null;
  transactionTimestamp: number;
};

export type OrderSwapFillOnChainSuccessEventV1 = DomainEventTransactionOnChain<
  OrderSwapFillOnChainSuccessEventPayloadV1,
  typeof eventType,
  1
>;
/*********************************************************/

export type OrderSwapFillOnChainSuccessEventPayload = DeepRequired<
  Pick<
    Private.OrderSwapOpenAndPartialFillBase,
    | 'userId'
    | 'toAssetId'
    | 'fromAssetId'
    | 'toAssetAmount'
    | 'fromAssetAmount'
    | 'price'
    | 'priceNumerator'
    | 'priceDenominator'
    | 'transactionTimestamp'
  >,
  ['userId']
>;

export type OrderSwapFillOnChainSuccessEvent = DomainEventTransactionOnChain<
  OrderSwapFillOnChainSuccessEventPayload,
  typeof eventType,
  typeof fillOnChainSuccessEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__FILL_ONCHAIN__SUCCESS;

export const fillOnChainSuccessEventVersion = 2;

export function isOrderSwapFillOnChainSuccessEvent(
  event: DomainEvent
): event is OrderSwapFillOnChainSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === fillOnChainSuccessEventVersion &&
    /**
     * This is a temporary fix to handle the fact that some old events
     * of this type were created with block_hash and block_slot set to null.
     * Unless we relax this check, we can't process these events, which result in
     * projection errors stopping new events from being processed.
     */
    isDomainEventTransaction(event)
  );
}
