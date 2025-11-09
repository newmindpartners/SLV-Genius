import {DomainEvent} from './DomainEvent';

type DomainEventHandler<State, Event> = (state: State, event: Event) => State;

export type DomainEventsHandler<State, Event extends DomainEvent> = Record<
  string,
  DomainEventHandler<State, Event>
>;
