import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import {OrderSwapOnChainFailureEventPayload} from './shared/OrderSwapOnChainEvent';

export type OrderSwapFillOnChainFailureEventPayload =
  OrderSwapOnChainFailureEventPayload;

export type OrderSwapFillOnChainFailureEvent = DomainEventMinimal<
  OrderSwapFillOnChainFailureEventPayload,
  typeof eventType
>;

const eventType = EventTypes.ORDER_SWAP__FILL_ONCHAIN__FAILURE;

export const fillOnChainFailureEventVersion = 1;

export function isOrderSwapFillOnChainFailureEvent(
  event: DomainEvent
): event is OrderSwapFillOnChainFailureEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === fillOnChainFailureEventVersion
  );
}
