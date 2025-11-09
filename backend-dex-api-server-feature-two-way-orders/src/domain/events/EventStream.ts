import {last, map} from 'lodash';

import * as Prisma from '@prisma/client';

import {DomainEvent} from '~/domain/events/DomainEvent';

import {ErrorCode} from '~/domain/errors';

export type EventStream<Event extends DomainEvent = DomainEvent> = {
  streamId: string;
  streamVersion: number;
  streamEvents: Event[];
  mutatedStreamEvents: Event[];
};

export type EventStreamEvent = {
  eventStream: EventStream<DomainEvent>;
  eventStreamEvent: DomainEvent;
};

export function makeEventStream(
  streamId: string,
  savedEvents: Prisma.Event[],
  eventMapper: (event: Prisma.Event) => DomainEvent
): EventStream<DomainEvent> {
  const lastEvent = last(savedEvents);
  if (lastEvent) {
    const {streamVersion} = lastEvent;

    const upcastedEvents = map(savedEvents, eventMapper);

    return {
      streamId,
      streamEvents: upcastedEvents,
      streamVersion,
      mutatedStreamEvents: [],
    };
  } else {
    throw new Error(ErrorCode.ORDER__EVENT_NOT_FOUND);
  }
}

export const appendEventToEventStream = <Event extends DomainEvent>(
  eventStream: EventStream<Event>,
  event: Event
): EventStream<Event> => {
  const {mutatedStreamEvents: oldMutatedStreamEvents} = eventStream;

  const newMutatedStreamEvents = [event];

  const mutatedStreamEvents = [
    ...oldMutatedStreamEvents,
    ...newMutatedStreamEvents,
  ];

  return {
    ...eventStream,
    mutatedStreamEvents,
  };
};
