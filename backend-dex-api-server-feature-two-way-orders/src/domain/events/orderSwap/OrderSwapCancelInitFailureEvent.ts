import * as Private from '~/domain/models/private';
import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

export type OrderSwapCancelInitFailureEventPayload = Private.UserReference &
  Private.OrderSwapReference &
  Private.ErrorCodeReason;

export type OrderSwapCancelInitFailureEvent = DomainEventMinimal<
  OrderSwapCancelInitFailureEventPayload,
  typeof eventType,
  typeof cancelInitFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__CANCEL_INIT__FAILURE;

export const cancelInitFailureEventVersion = 1;

export function isOrderSwapCancelInitFailureEvent(
  event: DomainEvent
): event is OrderSwapCancelInitFailureEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === cancelInitFailureEventVersion
  );
}
