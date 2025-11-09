import {
  DomainEvent,
  DomainEventTransaction,
  isDomainEventTransaction,
} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import * as Private from '~/domain/models/private';

export type OrderSwapOpenSubmitSuccessEventPayload = Private.OrderSwapReference;

export type OrderSwapOpenSubmitSuccessEvent = DomainEventTransaction<
  OrderSwapOpenSubmitSuccessEventPayload,
  typeof eventType,
  typeof openSubmitSuccessEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__OPEN_SUBMIT__SUCCESS;

export const openSubmitSuccessEventVersion = 1;

export function isOrderSwapOpenSubmitSuccessEvent(
  event: DomainEvent
): event is OrderSwapOpenSubmitSuccessEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === openSubmitSuccessEventVersion &&
    isDomainEventTransaction(event)
  );
}
