import 'reflect-metadata';

import {inject, injectable, singleton} from 'tsyringe';

import {flow, map, reduce, uniq} from 'lodash';
import {randomUUID} from 'crypto';

import * as Prisma from '@prisma/client';

import {Hex} from '~/domain/models/cardano';

import {
  AbstractEventStreamListener,
  DomainEvent,
  EventStream,
  isDomainEventTransaction,
  isDomainEventTransactionOnChain,
  makeEventStream,
  OrderSwapEventTypesArray,
} from '~/domain/events';

import {
  eventFilterOption,
  EventFilterOption,
  EventStreamRepository,
  FilterToEvent,
} from '~/domain/repositories';
import {upcastDomainEvent} from '~/domain/events/orderSwap/upcasts/index';
import {SmartVaultEventTypesArray} from '~/smartVaultFeature/event/types';

@singleton()
@injectable()
export class EventStreamRepositoryPrisma implements EventStreamRepository {
  domainEventListeners: AbstractEventStreamListener[];

  constructor(
    @inject('DomainEventListenerProjections')
    private readonly domainEventListenerProjections: AbstractEventStreamListener
  ) {
    this.domainEventListeners = [domainEventListenerProjections];
  }

  newEventStream(): EventStream {
    const streamId = randomUUID();

    const eventStream: EventStream = {
      streamId,
      streamEvents: [],
      streamVersion: 0,
      mutatedStreamEvents: [],
    };

    return eventStream;
  }

  async saveEventStream(
    prisma: Prisma.Prisma.TransactionClient,
    eventStream: EventStream
  ): Promise<EventStream> {
    const {mutatedStreamEvents} = eventStream;

    return reduce(
      mutatedStreamEvents,
      async (savedEventStreamPromise, mutatedStreamEvent) => {
        const savedEventStream = await savedEventStreamPromise;

        const newEventStream = await this.saveSingleEventStreamEvent(
          prisma,
          savedEventStream,
          mutatedStreamEvent
        );

        await this.notifyAll(prisma, mutatedStreamEvent, newEventStream);

        return newEventStream;
      },
      Promise.resolve(eventStream)
    );
  }

  async getEventStreamByEventId<Filter extends EventFilterOption>(
    prisma: Prisma.Prisma.TransactionClient,
    eventId: string,
    filter?: Filter
  ): Promise<EventStream<FilterToEvent<Filter>> | null> {
    const entityId = await this.getEntityIdByEventId(prisma, eventId);

    return await (entityId
      ? this.getEventStreamByStreamId(prisma, entityId, filter)
      : Promise.resolve(null));
  }

  async eventExistsByEventId(
    prisma: Prisma.Prisma.TransactionClient,
    eventId: string
  ): Promise<boolean> {
    const eventCount = await prisma.event.count({
      where: {eventId: eventId},
    });

    return eventCount > 0;
  }

  async getEventsByTransactionHash(
    prisma: Prisma.Prisma.TransactionClient,
    transactionHash: Hex
  ): Promise<Prisma.Event[]> {
    return prisma.event.findMany({
      where: {
        transactionHash,
      },
      orderBy: {
        created: 'asc',
      },
    });
  }

  async getEventStreamsByTransactionHash<Filter extends EventFilterOption>(
    prisma: Prisma.Prisma.TransactionClient,
    transactionHash: Hex,
    filter?: Filter
  ): Promise<EventStream<FilterToEvent<Filter>>[]> {
    const events = await this.getEventsByTransactionHash(
      prisma,
      transactionHash
    );

    const eventsStreamIds = uniq(map(events, 'streamId'));

    const eventStreams = await Promise.all(
      map(eventsStreamIds, streamId =>
        this.getEventStreamByStreamId(prisma, streamId, filter)
      )
    );

    return eventStreams;
  }

  async getEventsWhereBlockSlotGreaterThan(
    prisma: Prisma.Prisma.TransactionClient,
    blockSlot: number
  ): Promise<DomainEvent[]> {
    const events: Prisma.Event[] = await prisma.event.findMany({
      where: {
        blockSlot: {
          gt: blockSlot,
        },
      },
    });

    const domainEvents = events.map(this.toDomainEvent);
    const upcastedEvents = domainEvents.map(upcastDomainEvent);

    return upcastedEvents;
  }

  private getEventTypeFilter(
    filter: EventFilterOption
  ): Prisma.Prisma.EventFindManyArgs['where'] {
    switch (filter) {
      case eventFilterOption.ORDER_SWAP:
        return {
          eventType: {in: OrderSwapEventTypesArray},
        };
      case eventFilterOption.SMART_VAULT:
        return {
          eventType: {in: SmartVaultEventTypesArray},
        };
    }
  }

  async getEventStreamByStreamId<Filter extends EventFilterOption>(
    prisma: Prisma.Prisma.TransactionClient,
    streamId: string,
    filter?: Filter
  ): Promise<EventStream<FilterToEvent<Filter>>> {
    const savedEvents = await prisma.event.findMany({
      where: {
        streamId,
        ...(filter ? this.getEventTypeFilter(filter) : {}),
      },
      orderBy: {
        streamVersion: 'asc',
      },
    });

    const toDomainEventAndUpcast: (
      streamEvent: Prisma.Event
    ) => ReturnType<typeof upcastDomainEvent> = flow(
      this.toDomainEvent,
      upcastDomainEvent
    );

    const upcastedEventStream = makeEventStream(
      streamId,
      savedEvents,
      toDomainEventAndUpcast
    );

    const savedEventStream = await this.saveEventStream(
      prisma,
      upcastedEventStream
    );

    return savedEventStream as EventStream<FilterToEvent<Filter>>;
  }

  async getAllEventStreamIds(
    prisma: Prisma.Prisma.TransactionClient,
    filter?: EventFilterOption
  ): Promise<{streamId: string}[]> {
    const result = await prisma.event.findMany({
      select: {streamId: true},
      distinct: ['streamId'],
      ...(filter
        ? {
            where: this.getEventTypeFilter(filter),
          }
        : {}),
    });

    return result;
  }

  private async notifyAll(
    prisma: Prisma.Prisma.TransactionClient,
    event: DomainEvent,
    eventStream: EventStream
  ): Promise<void> {
    await Promise.all(
      map(this.domainEventListeners, async domainEventListener =>
        domainEventListener.handleEventStreamMutation(
          prisma,
          event,
          eventStream,
          this
        )
      )
    );
  }

  private async getEntityIdByEventId(
    prisma: Prisma.Prisma.TransactionClient,
    eventId: string
  ): Promise<string | undefined> {
    const event = await prisma.event.findUnique({
      where: {
        eventId,
      },
    });

    return event?.streamId;
  }

  private async saveSingleEventStreamEvent(
    prisma: Prisma.Prisma.TransactionClient,
    eventStream: EventStream<DomainEvent>,
    domainEvent: DomainEvent
  ): Promise<EventStream<DomainEvent>> {
    const {streamId, streamVersion} = eventStream;

    const mutatedStreamVersion = streamVersion + 1;

    const {
      eventId,
      eventType,
      eventVersion,
      eventPayload: domainEventPayload,
    } = domainEvent;

    const eventData: Prisma.Prisma.EventCreateInput = {
      streamId,
      streamVersion: mutatedStreamVersion,

      eventId,
      eventType,
      eventVersion,
      eventPayload: domainEventPayload as {},

      ...(isDomainEventTransaction(domainEvent)
        ? {transactionHash: domainEvent.transactionHash}
        : {}),
      ...(isDomainEventTransactionOnChain(domainEvent)
        ? {blockHash: domainEvent.blockHash, blockSlot: domainEvent.blockSlot}
        : {}),
    };

    const savedEvent = await prisma.event.create({data: eventData});

    const savedDomainEvent = this.toDomainEvent(savedEvent);

    const mutatedStreamEvents = [...eventStream.streamEvents, savedDomainEvent];

    return {
      streamId,
      streamEvents: mutatedStreamEvents,
      streamVersion: mutatedStreamVersion,
      mutatedStreamEvents: [],
    };
  }

  private toDomainEvent(streamEvent: Prisma.Event): DomainEvent {
    const {
      streamId,

      eventId,
      eventType,
      eventPayload,
      eventVersion,
      created,

      transactionHash,
      blockHash,
      blockSlot,
    } = streamEvent;

    return {
      created,

      streamId,

      eventId,
      eventType,
      eventVersion,
      eventPayload,

      ...(transactionHash && {transactionHash}),
      ...(blockHash && {blockHash}),
      ...(blockSlot && {blockSlot}),
    } as DomainEvent;
  }
}
