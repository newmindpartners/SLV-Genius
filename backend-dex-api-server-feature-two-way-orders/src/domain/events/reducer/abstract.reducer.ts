import {DomainEvent, DomainEventsHandler, EventStream} from '~/domain/events';

import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';
import {reduce} from 'lodash';

export abstract class AbstractReducer<State, Event extends DomainEvent> {
  reduce(eventStream: EventStream<Event>): State {
    const {streamId, streamEvents, mutatedStreamEvents} = eventStream;

    const events = [...streamEvents, ...mutatedStreamEvents];
    const filteredEvents = this.eventPreProcessor(events);

    const state = reduce(
      filteredEvents,
      this.handleEventAndReduce,
      this.getInitialState(streamId)
    );

    return state;
  }

  protected eventPreProcessor = (events: Event[]): Event[] => {
    return events;
  };

  protected handleEventAndReduce = (
    state: State,
    domainEvent: Event
  ): State => {
    const {eventType} = domainEvent;

    const eventHandler = this.getEventsHandler()[eventType];

    if (eventHandler) {
      return eventHandler(state, domainEvent);
    } else {
      throw new ApplicationError(
        ErrorCode.EVENT__FAILED_TO_RESOLVE_EVENT_HANDLER
      );
    }
  };

  protected abstract getInitialState(streamId: string): State;

  protected getEventsHandler(): DomainEventsHandler<State, Event> {
    return {};
  }
}
