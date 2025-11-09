import {find} from 'lodash';

import {Hex} from '~/domain/models/cardano';

import * as Private from '~/domain/models/private';

import {ErrorCode} from '~/domain/errors';
import {
  DomainEvent,
  DomainEventTransaction,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

export type OrderSwapCancelInitSuccessEventPayload = Private.UserReference &
  Private.OrderSwapReference & {
    utxoReferenceTransactionHash: Hex;
    utxoReferenceIndex: number;
  };

export type OrderSwapCancelInitSuccessEvent = DomainEventTransaction<
  OrderSwapCancelInitSuccessEventPayload,
  typeof eventType,
  typeof cancelInitSuccessEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__CANCEL_INIT__SUCCESS;

export const cancelInitSuccessEventVersion = 1;

export function isOrderSwapCancelInitSuccessEvent(
  event: DomainEvent
): event is OrderSwapCancelInitSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === cancelInitSuccessEventVersion &&
    isDomainEventTransaction(event)
  );
}

export function getOrderSwapCancelInitSuccessEvent(
  orderSwapEvents: DomainEvent[]
): OrderSwapCancelInitSuccessEvent | undefined {
  return find(orderSwapEvents, isOrderSwapCancelInitSuccessEvent);
}

export function getOrderSwapCancelInitSuccessEventOrThrow(
  orderSwapEvents: DomainEvent[]
): OrderSwapCancelInitSuccessEvent {
  const orderSwapCancelInitSuccessEvent =
    getOrderSwapCancelInitSuccessEvent(orderSwapEvents);
  if (orderSwapCancelInitSuccessEvent) {
    return orderSwapCancelInitSuccessEvent;
  } else {
    throw Error(ErrorCode.ORDER__EVENT_NOT_FOUND);
  }
}
