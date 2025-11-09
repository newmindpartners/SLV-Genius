import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import {OrderSwapOnChainFailureEventPayload} from './shared/OrderSwapOnChainEvent';

export type OrderSwapOpenOnChainFailureEventPayload =
  OrderSwapOnChainFailureEventPayload;

export type OrderSwapOpenOnChainFailureEvent = DomainEventMinimal<
  OrderSwapOpenOnChainFailureEventPayload,
  typeof eventType,
  typeof openOnChainFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__OPEN_ONCHAIN__FAILURE;

export const openOnChainFailureEventVersion = 1;

export function isOrderSwapOpenOnChainFailureEvent(
  event: DomainEvent
): event is OrderSwapOpenOnChainFailureEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === openOnChainFailureEventVersion
  );
}
