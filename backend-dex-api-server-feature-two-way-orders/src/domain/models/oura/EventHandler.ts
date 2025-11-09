import {TransactionalContext} from '~/domain/context';

import * as Oura from '~/domain/models/oura';

export interface EventHandler {
  getEventHandlerMap(): HandlerFunctionMap<Oura.Event>;
}

export type HandlerFunctionMap<T extends Oura.Event> = {
  [P in T['variant']]?: HandlerFunction<T>[];
};

export type HandlerFunction<T> = (
  context: TransactionalContext,
  event: T
) => Promise<void> | void;
