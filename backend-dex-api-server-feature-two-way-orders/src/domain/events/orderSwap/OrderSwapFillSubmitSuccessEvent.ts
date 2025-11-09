import {
  DomainEvent,
  DomainEventTransaction,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

export type OrderSwapFillSubmitSuccessEventPayload = Private.OrderSwapReference;

export type OrderSwapFillSubmitSuccessEvent = DomainEventTransaction<
  OrderSwapFillSubmitSuccessEventPayload,
  typeof eventType,
  typeof fillSubmitSuccessEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__FILL_SUBMIT__SUCCESS;

export const fillSubmitSuccessEventVersion = 1;

export function isOrderSwapFillSubmitSuccessEvent(
  event: DomainEvent
): event is OrderSwapFillSubmitSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === fillSubmitSuccessEventVersion &&
    isDomainEventTransaction(event)
  );
}
