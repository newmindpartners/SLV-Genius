import {filter, includes} from 'lodash';
import * as loFp from 'lodash/fp';

import {EventTypes} from '../../../EventTypes';
import {
  FailureEventType,
  OrderSwapEvent,
} from '../../../orderSwap/OrderSwapEvent';
import {
  isOnChainFailureEvent,
  OrderSwapOnChainFailureEvent,
} from '../../../orderSwap/shared/OrderSwapOnChainEvent';

/**
 * If our events contain the failure events that should invalidate its
 * respective success event, we filter out both of these.
 * The resulting events represent a state where this event never occurred.
 */
const invalidatingFailureEventTypes: FailureEventType[] = [
  EventTypes.ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE,
  EventTypes.ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE,
  EventTypes.ORDER_SWAP__CANCEL_ONCHAIN__FAILURE,
];

const isInvalidatingFailureEventType = (
  event: OrderSwapEvent
): event is OrderSwapOnChainFailureEvent =>
  includes(invalidatingFailureEventTypes, event.eventType) &&
  isOnChainFailureEvent(event);

/**
 * We collect both the invalidating failure event, as well as the event which it
 * is invalidated by that event.
 */
const collectInvalidatedEventIds = (
  invalidatingEvent: OrderSwapOnChainFailureEvent
) => [
  invalidatingEvent.eventId,
  invalidatingEvent.eventPayload.errorDetails.invalidatedEventId,
];

const excludeEventsByInvalidatedEventIds =
  (events: OrderSwapEvent[]) =>
  (invalidatedEventIds: string[]): OrderSwapEvent[] =>
    filter(events, ({eventId}) => !includes(invalidatedEventIds, eventId));

export const excludeInvalidatedEvents = (
  events: OrderSwapEvent[]
): OrderSwapEvent[] => {
  const validEvents = loFp.flow(
    loFp.filter(isInvalidatingFailureEventType),
    loFp.flatMap(collectInvalidatedEventIds),
    excludeEventsByInvalidatedEventIds(events)
  )(events);

  return validEvents;
};
