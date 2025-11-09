import {includes, keys} from 'lodash';
import {Hex} from '~/domain/models/cardano';
import {invertRecord} from '~/domain/utils/object.util';

import {ExtractBySubstring} from '~/implementation/utils/typescript';
import {DomainEvent, OrderSwapEvent, OrderSwapEventType} from '../..';
import {OrderSwapFailureEventPayload} from './OrderSwapFailureEventPayload';
/**
 * We make the assumption that all successful on-chain events contain the
 * substring 'ONCHAIN__SUCCESS'.
 * Doing this instead of adding each on-chain success event manually has the
 * benefit of picking up new such events without us having to update our types.
 */
export type OnChainSuccessEventType = ExtractBySubstring<
  OrderSwapEventType,
  'ONCHAIN__SUCCESS'
>;
export type OnChainFailureEventType = ExtractBySubstring<
  OrderSwapEventType,
  'ONCHAIN__FAILURE'
>;

export type OrderSwapOnChainFailureEventPayload =
  OrderSwapFailureEventPayload & {
    errorDetails: OnChainFailureErrorDetails;
  };

export type OrderSwapOnChainSuccessEvent = Extract<
  OrderSwapEvent,
  {eventType: OnChainSuccessEventType}
>;

export type OrderSwapOnChainFailureEvent = Extract<
  OrderSwapEvent,
  {eventType: OnChainFailureEventType}
>;

export type OnChainFailureErrorDetails = {
  rollBackBlock: {
    blockHash: Hex;
    blockSlot: number;
  };
  eventReceivedAt: Date;
  invalidatedEventId: string;
  invalidatedTransactionHash: Hex;
};

/**
 * In the case of a rollback event on-chain, each event stream containing an
 * on-chain success event should have an equivalent failure event appended to it.
 */
export const onChainEventSuccessToFailureMapper: Record<
  OnChainSuccessEventType,
  OnChainFailureEventType
> = {
  ORDER_SWAP__OPEN_ONCHAIN__SUCCESS: 'ORDER_SWAP__OPEN_ONCHAIN__FAILURE',
  ORDER_SWAP__FILL_ONCHAIN__SUCCESS: 'ORDER_SWAP__FILL_ONCHAIN__FAILURE',
  ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS:
    'ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE',
  ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS:
    'ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE',
  ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS: 'ORDER_SWAP__CANCEL_ONCHAIN__FAILURE',
};

export const onChainEventFailureToSuccessMapper: Record<
  OnChainFailureEventType,
  OnChainSuccessEventType
> = invertRecord(onChainEventSuccessToFailureMapper);

export const ONCHAIN_SUCCESS_EVENT_TYPES: OnChainSuccessEventType[] = keys(
  onChainEventSuccessToFailureMapper
) as OnChainSuccessEventType[];

export const ONCHAIN_FAILURE_EVENT_TYPES: OnChainFailureEventType[] = keys(
  onChainEventFailureToSuccessMapper
) as OnChainFailureEventType[];

export const isOnChainSuccessEvent = (
  event: DomainEvent
): event is OrderSwapOnChainSuccessEvent =>
  includes(ONCHAIN_SUCCESS_EVENT_TYPES, event.eventType);

export const isOnChainFailureEvent = (
  event: DomainEvent
): event is OrderSwapOnChainFailureEvent =>
  includes(ONCHAIN_FAILURE_EVENT_TYPES, event.eventType);
