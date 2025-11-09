import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

export type OrderSwapOpenInitFailureEventPayload = Private.UserReference &
  Private.OrderSwapReference &
  Private.ErrorCodeReason;

export type OrderSwapOpenInitFailureEvent = DomainEventMinimal<
  OrderSwapOpenInitFailureEventPayload,
  typeof eventType,
  typeof openInitFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__OPEN_INIT__FAILURE;

export const openInitFailureEventVersion = 1;

export function isOrderSwapOpenInitFailureEvent(
  event: DomainEvent
): event is OrderSwapOpenInitFailureEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === openInitFailureEventVersion
  );
}
