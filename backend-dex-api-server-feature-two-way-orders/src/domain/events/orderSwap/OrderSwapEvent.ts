import {OrderSwapCancelEvent} from './OrderSwapCancelEvent';
import {OrderSwapOpenEvent} from './OrderSwapOpenEvent';
import {OrderSwapFillEvent} from './OrderSwapFillEvent';
import {
  DomainEvent,
  DomainEventMinimal,
  DomainEventTransaction,
  DomainEventTransactionOnChain,
} from '../DomainEvent';
import {Hex} from '~/domain/models/cardano';
import {ExtractBySubstring} from '~/implementation/utils/typescript';
import {randomUUID} from 'crypto';
import {OrderSwapPartialFillEvent} from './OrderSwapPartialFillEvent';
import {OrderSwapFinalFillEvent} from './OrderSwapFinalFillEvent';

import {EventType, EventTypes} from '../EventTypes';

import {
  cancelInitFailureEventVersion,
  OrderSwapCancelInitFailureEvent,
} from './OrderSwapCancelInitFailureEvent';
import {
  cancelInitRequestEventVersion,
  OrderSwapCancelInitRequestEvent,
} from './OrderSwapCancelInitRequestEvent';
import {
  cancelInitSuccessEventVersion,
  OrderSwapCancelInitSuccessEvent,
} from './OrderSwapCancelInitSuccessEvent';
import {
  cancelSubmitSuccessEventVersion,
  OrderSwapCancelSubmitSuccessEvent,
} from './OrderSwapCancelSubmitSuccessEvent';
import {
  cancelSubmitFailureEventVersion,
  OrderSwapCancelSubmitFailureEvent,
} from './OrderSwapCancelSubmitFailureEvent';
import {
  cancelOnChainSuccessEventVersion,
  OrderSwapCancelOnChainSuccessEvent,
} from './OrderSwapCancelOnChainSuccessEvent';
import {
  cancelOnChainFailureEventVersion,
  OrderSwapCancelOnChainFailureEvent,
} from './OrderSwapCancelOnChainFailureEvent';
import {
  openInitRequestEventVersion,
  OrderSwapOpenInitRequestEvent,
} from './OrderSwapOpenInitRequestEvent';
import {
  openInitSuccessEventVersion,
  OrderSwapOpenInitSuccessEvent,
} from './OrderSwapOpenInitSuccessEvent';
import {
  openInitFailureEventVersion,
  OrderSwapOpenInitFailureEvent,
} from './OrderSwapOpenInitFailureEvent';
import {
  openSubmitSuccessEventVersion,
  OrderSwapOpenSubmitSuccessEvent,
} from './OrderSwapOpenSubmitSuccessEvent';
import {
  openSubmitFailureEventVersion,
  OrderSwapOpenSubmitFailureEvent,
} from './OrderSwapOpenSubmitFailureEvent';
import {
  openOnChainSuccessEventVersion,
  OrderSwapOpenOnChainSuccessEvent,
} from './OrderSwapOpenOnChainSuccessEvent';
import {
  openOnChainFailureEventVersion,
  OrderSwapOpenOnChainFailureEvent,
} from './OrderSwapOpenOnChainFailureEvent';
import {
  OrderSwapPartialFillOnChainSuccessEvent,
  partialFillOnChainSuccessEventVersion,
} from './OrderSwapPartialFillOnChainSuccessEvent';
import {
  OrderSwapPartialFillOnChainFailureEvent,
  partialFillOnChainFailureEventVersion,
} from './OrderSwapPartialFillOnChainFailureEvent';
import {
  finalFillOnChainSuccessEventVersion,
  OrderSwapFinalFillOnChainSuccessEvent,
} from './OrderSwapFinalFillOnChainSuccessEvent';
import {
  finalFillOnChainFailureEventVersion,
  OrderSwapFinalFillOnChainFailureEvent,
} from './OrderSwapFinalFillOnChainFailureEvent';
import {
  fillInitRequestEventVersion,
  OrderSwapFillInitRequestEvent,
} from './OrderSwapFillInitRequestEvent';
import {
  fillInitSuccessEventVersion,
  OrderSwapFillInitSuccessEvent,
} from './OrderSwapFillInitSuccessEvent';
import {
  fillInitFailureEventVersion,
  OrderSwapFillInitFailureEvent,
} from './OrderSwapFillInitFailureEvent';
import {
  fillSubmitSuccessEventVersion,
  OrderSwapFillSubmitSuccessEvent,
} from './OrderSwapFillSubmitSuccessEvent';
import {
  fillSubmitFailureEventVersion,
  OrderSwapFillSubmitFailureEvent,
} from './OrderSwapFillSubmitFailureEvent';
import {
  fillOnChainSuccessEventVersion,
  OrderSwapFillOnChainSuccessEvent,
} from './OrderSwapFillOnChainSuccessEvent';
import {
  fillOnChainFailureEventVersion,
  OrderSwapFillOnChainFailureEvent,
} from './OrderSwapFillOnChainFailureEvent';
import {getKeys} from '~/domain/utils/typescript.util';

export * from './OrderSwapCancelInitFailureEvent';
export * from './OrderSwapCancelInitRequestEvent';
export * from './OrderSwapCancelInitSuccessEvent';
export * from './OrderSwapCancelSubmitSuccessEvent';
export * from './OrderSwapCancelSubmitFailureEvent';
export * from './OrderSwapCancelOnChainSuccessEvent';
export * from './OrderSwapCancelOnChainFailureEvent';
export * from './OrderSwapOpenInitRequestEvent';
export * from './OrderSwapOpenInitSuccessEvent';
export * from './OrderSwapOpenInitFailureEvent';
export * from './OrderSwapOpenSubmitSuccessEvent';
export * from './OrderSwapOpenSubmitFailureEvent';
export * from './OrderSwapOpenOnChainSuccessEvent';
export * from './OrderSwapOpenOnChainFailureEvent';
export * from './OrderSwapPartialFillOnChainSuccessEvent';
export * from './OrderSwapPartialFillOnChainFailureEvent';
export * from './OrderSwapFinalFillOnChainSuccessEvent';
export * from './OrderSwapFinalFillOnChainFailureEvent';
export * from './OrderSwapFillInitRequestEvent';
export * from './OrderSwapFillInitSuccessEvent';
export * from './OrderSwapFillInitFailureEvent';
export * from './OrderSwapFillSubmitSuccessEvent';
export * from './OrderSwapFillSubmitFailureEvent';
export * from './OrderSwapFillOnChainSuccessEvent';
export * from './OrderSwapFillOnChainFailureEvent';

export type OrderSwapEvent =
  | OrderSwapOpenEvent
  | OrderSwapFillEvent
  | OrderSwapCancelEvent
  | OrderSwapPartialFillEvent
  | OrderSwapFinalFillEvent;

export const ORDER_SWAP_IDENTIFIER = 'ORDER_SWAP';

export type OrderSwapEventType = ExtractBySubstring<
  EventType,
  typeof ORDER_SWAP_IDENTIFIER
>;

const isOrderSwapEventType = (
  eventType: EventType
): eventType is OrderSwapEventType => eventType.includes(ORDER_SWAP_IDENTIFIER);

export const OrderSwapEventTypesArray: OrderSwapEventType[] =
  getKeys(EventTypes).filter(isOrderSwapEventType);

const OrderSwapEventVersions: Record<OrderSwapEventType, number> = {
  ORDER_SWAP__OPEN_INIT__REQUEST: openInitRequestEventVersion,
  ORDER_SWAP__OPEN_INIT__SUCCESS: openInitSuccessEventVersion,
  ORDER_SWAP__OPEN_INIT__FAILURE: openInitFailureEventVersion,
  ORDER_SWAP__OPEN_SUBMIT__SUCCESS: openSubmitSuccessEventVersion,
  ORDER_SWAP__OPEN_SUBMIT__FAILURE: openSubmitFailureEventVersion,
  ORDER_SWAP__OPEN_ONCHAIN__SUCCESS: openOnChainSuccessEventVersion,
  ORDER_SWAP__OPEN_ONCHAIN__FAILURE: openOnChainFailureEventVersion,
  ORDER_SWAP__PARTIAL_FILL_ONCHAIN__SUCCESS:
    partialFillOnChainSuccessEventVersion,
  ORDER_SWAP__PARTIAL_FILL_ONCHAIN__FAILURE:
    partialFillOnChainFailureEventVersion,
  ORDER_SWAP__FINAL_FILL_ONCHAIN__SUCCESS: finalFillOnChainSuccessEventVersion,
  ORDER_SWAP__FINAL_FILL_ONCHAIN__FAILURE: finalFillOnChainFailureEventVersion,
  ORDER_SWAP__FILL_INIT__REQUEST: fillInitRequestEventVersion,
  ORDER_SWAP__FILL_INIT__SUCCESS: fillInitSuccessEventVersion,
  ORDER_SWAP__FILL_INIT__FAILURE: fillInitFailureEventVersion,
  ORDER_SWAP__FILL_SUBMIT__SUCCESS: fillSubmitSuccessEventVersion,
  ORDER_SWAP__FILL_SUBMIT__FAILURE: fillSubmitFailureEventVersion,
  ORDER_SWAP__FILL_ONCHAIN__SUCCESS: fillOnChainSuccessEventVersion,
  ORDER_SWAP__FILL_ONCHAIN__FAILURE: fillOnChainFailureEventVersion,
  ORDER_SWAP__CANCEL_INIT__REQUEST: cancelInitRequestEventVersion,
  ORDER_SWAP__CANCEL_INIT__SUCCESS: cancelInitSuccessEventVersion,
  ORDER_SWAP__CANCEL_INIT__FAILURE: cancelInitFailureEventVersion,
  ORDER_SWAP__CANCEL_SUBMIT__SUCCESS: cancelSubmitSuccessEventVersion,
  ORDER_SWAP__CANCEL_SUBMIT__FAILURE: cancelSubmitFailureEventVersion,
  ORDER_SWAP__CANCEL_ONCHAIN__SUCCESS: cancelOnChainSuccessEventVersion,
  ORDER_SWAP__CANCEL_ONCHAIN__FAILURE: cancelOnChainFailureEventVersion,
} as const;

export type OrderSwapEventVersion = typeof OrderSwapEventVersions;

export const isOrderSwapEvent = (
  event: DomainEvent
): event is OrderSwapEvent => {
  return event.eventType.includes(ORDER_SWAP_IDENTIFIER);
};

export type SuccessEventType = ExtractBySubstring<
  OrderSwapEventType,
  'SUCCESS'
>;
export type FailureEventType = ExtractBySubstring<
  OrderSwapEventType,
  'FAILURE'
>;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapOpenInitRequestEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapOpenInitFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapFillInitRequestEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapFillInitFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapCancelInitRequestEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapCancelInitFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapOpenOnChainFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapFillOnChainFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapPartialFillOnChainFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapFinalFillOnChainFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapCancelOnChainFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload']
): Event;

/**
 * This overload is required for `makeOrderSwapDomainEventTransaction`.
 * Without it, TypeScript tries to match inputs with the specific overloads
 * above and errors for other event types.
 */
export function makeOrderSwapDomainEvent<
  Event extends DomainEventTransaction,
  EventType extends Event['eventType'],
  EventPayload extends Event['eventPayload']
>(
  orderSwapId: string,
  eventType: EventType,
  eventPayload: EventPayload
): DomainEventMinimal<EventPayload, EventType>;

export function makeOrderSwapDomainEvent<
  Event extends OrderSwapEvent,
  EventPayload extends Event['eventPayload'],
  EventType extends Event['eventType']
>(
  orderSwapId: string,
  eventType: EventType,
  eventPayload: EventPayload
): DomainEventMinimal<EventPayload, EventType> {
  return {
    streamId: orderSwapId,

    eventId: randomUUID(),
    eventType,
    eventVersion: OrderSwapEventVersions[eventType],

    created: new Date(),

    eventPayload,
  };
}

export function makeOrderSwapDomainEventTransaction<
  Event extends OrderSwapOpenInitSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex
): Event;

export function makeOrderSwapDomainEventTransaction<
  Event extends OrderSwapOpenSubmitSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex
): Event;

export function makeOrderSwapDomainEventTransaction<
  Event extends OrderSwapOpenSubmitFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex
): Event;

export function makeOrderSwapDomainEventTransaction<
  Event extends OrderSwapFillInitSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex
): Event;

export function makeOrderSwapDomainEventTransaction<
  Event extends OrderSwapFillSubmitSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex
): Event;

export function makeOrderSwapDomainEventTransaction<
  Event extends OrderSwapFillSubmitFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex
): Event;

export function makeOrderSwapDomainEventTransaction<
  Event extends OrderSwapCancelInitSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex
): Event;

export function makeOrderSwapDomainEventTransaction<
  Event extends OrderSwapCancelSubmitSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex
): Event;

export function makeOrderSwapDomainEventTransaction<
  Event extends OrderSwapCancelSubmitFailureEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex
): Event;

export function makeOrderSwapDomainEventTransaction<
  Event extends DomainEventTransaction,
  EventPayload extends Event['eventPayload'],
  EventType extends Event['eventType']
>(
  orderSwapId: string,
  eventType: EventType,
  eventPayload: EventPayload,
  transactionHash: Hex
): DomainEventTransaction<EventPayload, EventType>;

export function makeOrderSwapDomainEventTransaction<
  Event extends DomainEventTransaction,
  EventPayload extends Event['eventPayload'],
  EventType extends Event['eventType']
>(
  orderSwapId: string,
  eventType: EventType,
  eventPayload: EventPayload,
  transactionHash: Hex
): DomainEventTransaction<EventPayload, EventType> {
  return {
    ...makeOrderSwapDomainEvent(orderSwapId, eventType, eventPayload),
    transactionHash,
  };
}

export function makeOrderSwapDomainEventTransactionOnChain<
  Event extends OrderSwapOpenOnChainSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex,
  blockHash: Hex,
  blockSlot: bigint
): Event;

export function makeOrderSwapDomainEventTransactionOnChain<
  Event extends OrderSwapPartialFillOnChainSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex,
  blockHash: Hex,
  blockSlot: bigint
): Event;

export function makeOrderSwapDomainEventTransactionOnChain<
  Event extends OrderSwapFinalFillOnChainSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex,
  blockHash: Hex,
  blockSlot: bigint
): Event;

export function makeOrderSwapDomainEventTransactionOnChain<
  Event extends OrderSwapFillOnChainSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex,
  blockHash: Hex,
  blockSlot: bigint
): Event;

export function makeOrderSwapDomainEventTransactionOnChain<
  Event extends OrderSwapCancelOnChainSuccessEvent
>(
  orderSwapId: string,
  eventType: Event['eventType'],
  eventPayload: Event['eventPayload'],
  transactionHash: Hex,
  blockHash: Hex,
  blockSlot: bigint
): Event;

export function makeOrderSwapDomainEventTransactionOnChain<
  EventPayload extends OrderSwapEvent['eventPayload'],
  EventType extends OrderSwapEvent['eventType']
>(
  orderSwapId: string,
  eventType: EventType,
  eventPayload: EventPayload,
  transactionHash: Hex,
  blockHash: Hex,
  blockSlot: bigint
): DomainEventTransactionOnChain<EventPayload, EventType> {
  return {
    ...makeOrderSwapDomainEventTransaction(
      orderSwapId,
      eventType,
      eventPayload,
      transactionHash
    ),
    blockHash,
    blockSlot,
  };
}
