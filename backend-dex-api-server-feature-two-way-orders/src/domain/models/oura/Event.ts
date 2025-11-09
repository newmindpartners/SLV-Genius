import {EventContext} from './EventContext';

import {Block} from './Block';
import {RollBack} from './RollBack';
import {Transaction} from './Transaction';

export type EventVariant = 'Transaction' | 'BlockEnd' | 'RollBack';

// https://github.com/txpipe/oura/blob/main/book/src/reference/data_dictionary.md#transaction-event

export type Event = BlockEvent | RollBackEvent | TransactionEvent;

type EventAbstract = {
  variant: EventVariant;
  context: EventContext;
};

export type BlockEvent = {
  variant: 'BlockEnd';
  block_end: Block;
} & EventAbstract;

export type RollBackEvent = {
  variant: 'RollBack';
  roll_back: RollBack;
} & EventAbstract;

export type TransactionEvent = {
  variant: 'Transaction';
  transaction: Transaction;
} & EventAbstract;

export const isBlockEvent = (ouraEvent: Event): ouraEvent is BlockEvent =>
  ouraEvent.variant === 'BlockEnd' && !!ouraEvent?.block_end;

export const isRollBackEvent = (ouraEvent: Event): ouraEvent is RollBackEvent =>
  ouraEvent.variant === 'RollBack' && !!ouraEvent?.roll_back;

export const isTransactionEvent = (
  ouraEvent: Event
): ouraEvent is TransactionEvent =>
  ouraEvent.variant === 'Transaction' && !!ouraEvent?.transaction;
