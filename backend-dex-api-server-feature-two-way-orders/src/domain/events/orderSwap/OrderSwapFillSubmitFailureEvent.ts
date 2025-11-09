import {
  DomainEvent,
  DomainEventTransaction,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

export type OrderSwapFillSubmitFailureEventPayload =
  Private.OrderSwapReference & Private.ErrorCodeReason;

export type OrderSwapFillSubmitFailureEvent = DomainEventTransaction<
  OrderSwapFillSubmitFailureEventPayload,
  typeof eventType,
  typeof fillSubmitFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__FILL_SUBMIT__FAILURE;

export const fillSubmitFailureEventVersion = 1;

export function isOrderSwapFillSubmitFailureEvent(
  event: DomainEvent
): event is OrderSwapFillSubmitFailureEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === fillSubmitFailureEventVersion &&
    isDomainEventTransaction(event)
  );
}
