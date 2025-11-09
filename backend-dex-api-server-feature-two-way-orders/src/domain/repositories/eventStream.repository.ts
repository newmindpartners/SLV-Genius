import 'reflect-metadata';

import * as Prisma from '@prisma/client';

import {
  DomainEvent,
  EventStream,
  OrderSwapEvent,
  ORDER_SWAP_IDENTIFIER,
} from '~/domain/events';
import {
  SmartVaultEvent,
  SMART_VAULT_IDENTIFIER,
} from '~/smartVaultFeature/event/types';

import {Hex} from '~/domain/models/cardano';

import {TransactionalContext} from '~/domain/context';

export const eventFilterOption = {
  ORDER_SWAP: ORDER_SWAP_IDENTIFIER,
  SMART_VAULT: SMART_VAULT_IDENTIFIER,
} as const;

export type EventFilterOption =
  (typeof eventFilterOption)[keyof typeof eventFilterOption];

export type FilterToEvent<T extends EventFilterOption> =
  T extends typeof eventFilterOption.ORDER_SWAP
    ? OrderSwapEvent
    : T extends typeof eventFilterOption.SMART_VAULT
    ? SmartVaultEvent
    : DomainEvent;

export interface EventStreamRepository<
  Event extends DomainEvent = DomainEvent
> {
  newEventStream(): EventStream<Event>;

  saveEventStream(
    context: TransactionalContext,
    eventStream: EventStream<Event>
  ): Promise<EventStream<Event>>;

  getEventStreamByStreamId<Filter extends EventFilterOption>(
    context: TransactionalContext,
    streamId: string,
    filter?: Filter
  ): Promise<EventStream<FilterToEvent<Filter>>>;

  getAllEventStreamIds(
    prisma: Prisma.Prisma.TransactionClient,
    filter?: EventFilterOption
  ): Promise<{streamId: string}[]>;

  getEventStreamByEventId<Filter extends EventFilterOption>(
    context: TransactionalContext,
    eventId: string,
    filter?: Filter
  ): Promise<EventStream<FilterToEvent<Filter>> | null>;

  eventExistsByEventId(
    context: TransactionalContext,
    eventId: string
  ): Promise<boolean>;

  getEventStreamsByTransactionHash<Filter extends EventFilterOption>(
    prisma: Prisma.Prisma.TransactionClient,
    transactionHash: Hex,
    filter?: Filter
  ): Promise<EventStream<FilterToEvent<Filter>>[]>;

  getEventsWhereBlockSlotGreaterThan(
    prisma: Prisma.Prisma.TransactionClient,
    blockSlot: number
  ): Promise<DomainEvent[]>;
}
