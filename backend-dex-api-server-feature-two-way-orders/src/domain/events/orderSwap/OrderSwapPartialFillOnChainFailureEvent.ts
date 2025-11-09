import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import {OrderSwapOnChainFailureEventPayload} from './shared/OrderSwapOnChainEvent';

export type OrderSwapPartialFillOnChainFailureEventPayload =
  OrderSwapOnChainFailureEventPayload;

export type OrderSwapPartialFillOnChainFailureEvent = DomainEventMinimal<
  OrderSwapPartialFillOnChainFailureEventPayload,
  typeof eventType,
  typeof partialFillOnChainFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE;

export const partialFillOnChainFailureEventVersion = 1;

export function isOrderSwapPartialFillOnChainFailureEvent(
  event: DomainEvent
): event is OrderSwapPartialFillOnChainFailureEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === partialFillOnChainFailureEventVersion
  );
}
