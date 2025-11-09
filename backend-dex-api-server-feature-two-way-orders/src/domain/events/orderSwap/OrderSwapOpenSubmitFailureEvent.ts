import {
  DomainEvent,
  DomainEventTransaction,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

export type OrderSwapOpenSubmitFailureEventPayload =
  Private.OrderSwapReference & Private.ErrorCodeReason;

export type OrderSwapOpenSubmitFailureEvent = DomainEventTransaction<
  OrderSwapOpenSubmitFailureEventPayload,
  typeof eventType,
  typeof openSubmitFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__OPEN_SUBMIT__FAILURE;

export const openSubmitFailureEventVersion = 1;

export function isOrderSwapOpenSubmitFailureEvent(
  event: DomainEvent
): event is OrderSwapOpenSubmitFailureEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === openSubmitFailureEventVersion &&
    isDomainEventTransaction(event)
  );
}
