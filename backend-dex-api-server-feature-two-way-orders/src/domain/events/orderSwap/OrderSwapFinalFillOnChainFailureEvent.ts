import {DomainEvent, DomainEventMinimal} from '../DomainEvent';
import {EventTypes} from '../EventTypes';

import {OrderSwapOnChainFailureEventPayload} from './shared/OrderSwapOnChainEvent';

export type OrderSwapFinalFillOnChainFailureEventPayload =
  OrderSwapOnChainFailureEventPayload;

export type OrderSwapFinalFillOnChainFailureEvent = DomainEventMinimal<
  OrderSwapFinalFillOnChainFailureEventPayload,
  typeof eventType,
  typeof finalFillOnChainFailureEventVersion
>;

const eventType = EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE;

export const finalFillOnChainFailureEventVersion = 1;

export function isOrderSwapFinalFillOnChainFailureEvent(
  event: DomainEvent
): event is OrderSwapFinalFillOnChainFailureEvent {
  return (
    eventType === event.eventType &&
    event.eventVersion === finalFillOnChainFailureEventVersion
  );
}
