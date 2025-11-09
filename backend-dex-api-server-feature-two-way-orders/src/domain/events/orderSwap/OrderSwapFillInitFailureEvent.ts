import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

export type OrderSwapFillInitFailureEventPayload = Private.UserReference &
  Private.OrderSwapReference &
  Private.ErrorCodeReason;

export type OrderSwapFillInitFailureEvent = DomainEventMinimal<
  OrderSwapFillInitFailureEventPayload,
  typeof eventType,
  typeof fillInitFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__FILL_INIT__FAILURE;

export const fillInitFailureEventVersion = 1;

export function isOrderSwapFillInitFailureEvent(
  event: DomainEvent
): event is OrderSwapFillInitFailureEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === fillInitFailureEventVersion
  );
}
