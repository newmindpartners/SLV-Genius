import {Hex} from '~/domain/models/cardano';
import {
  SmartVaultEvent,
  SmartVaultEventVersion,
} from '~/smartVaultFeature/event/types';

import {EventType as DomainEventType} from './EventTypes';
import {
  OrderSwapEvent,
  OrderSwapEventVersion,
} from './orderSwap/OrderSwapEvent';

export type DomainEvent = OrderSwapEvent | SmartVaultEvent;
export type DomainEventVersion = OrderSwapEventVersion & SmartVaultEventVersion;

export type DomainEventMinimal<
  EventPayload extends {} = {},
  EventType extends DomainEventType = DomainEventType,
  EventVersion extends number = DomainEventVersion[EventType]
> = {
  created: Date;

  streamId: string;

  eventId: string;
  eventType: EventType;
  eventVersion: EventVersion;
  eventPayload: EventPayload;
};

type DomainEventTransactionData = {
  transactionHash: Hex;
};

export type DomainEventTransaction<
  EventPayload extends {} = {},
  EventType extends DomainEventType = DomainEventType,
  EventVersion extends number = DomainEventVersion[EventType]
> = DomainEventMinimal<EventPayload, EventType, EventVersion> &
  DomainEventTransactionData;

type DomainEventBlockData = {
  blockHash: Hex;
  blockSlot: bigint;
};

export type DomainEventTransactionOnChain<
  EventPayload extends {} = {},
  EventType extends DomainEventType = DomainEventType,
  EventVersion extends number = DomainEventVersion[EventType]
> = DomainEventTransaction<EventPayload, EventType, EventVersion> &
  DomainEventBlockData;

type DomainEventTransactionSubset = Extract<
  DomainEvent,
  DomainEventTransactionData
>;
export const isDomainEventTransaction = (
  event: DomainEvent
): event is DomainEventTransactionSubset =>
  'transactionHash' in event && typeof event.transactionHash === 'string';

type DomainEventTransactionOnChainSubset = Extract<
  DomainEvent,
  DomainEventTransactionData & DomainEventBlockData
>;
export const isDomainEventTransactionOnChain = (
  event: DomainEvent
): event is DomainEventTransactionOnChainSubset =>
  isDomainEventTransaction(event) &&
  'blockHash' in event &&
  typeof event.blockHash === 'string' &&
  'blockSlot' in event &&
  typeof event.blockSlot === 'bigint';
