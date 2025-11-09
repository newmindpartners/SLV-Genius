import * as Private from '~/domain/models/private';
import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

export type OrderSwapCancelInitRequestEventPayload = Private.UserReference &
  Private.OrderSwapReference;

export type OrderSwapCancelInitRequestEvent = DomainEventMinimal<
  OrderSwapCancelInitRequestEventPayload,
  typeof eventType,
  typeof cancelInitRequestEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__CANCEL_INIT__REQUEST;

export const cancelInitRequestEventVersion = 1;

export function isOrderSwapCancelInitRequestEvent(
  event: DomainEvent
): event is OrderSwapCancelInitRequestEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === cancelInitRequestEventVersion
  );
}
