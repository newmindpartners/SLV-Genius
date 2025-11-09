import {TransactionalContext} from '~/domain/context';
import * as Private from '~/domain/models/private';

export interface TransactionSubmitOrPostProcessHandler<
  HandlingTransaction,
  HandledTransaction
> {
  handleTransaction(
    context: TransactionalContext,
    transaction: HandlingTransaction
  ): Promise<HandledTransaction>;
}

export type TransactionSubmitOrPostProcessHandlerMap<
  HandlingTransaction,
  HandledTransaction
> = {
  [eventType in Private.EventsType]: TransactionSubmitOrPostProcessHandler<
    HandlingTransaction,
    HandledTransaction
  >;
};
