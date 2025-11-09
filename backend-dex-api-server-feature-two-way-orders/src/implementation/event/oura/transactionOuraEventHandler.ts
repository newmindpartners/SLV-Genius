import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Oura from '~/domain/models/oura';

import {TransactionRepository} from '~/domain/repositories';

@singleton()
@injectable()
export class TransactionOuraEventHandler implements Oura.EventHandler {
  constructor(
    @inject('TransactionRepository')
    private transactionRepository: TransactionRepository
  ) {}

  getEventHandlerMap(): Oura.HandlerFunctionMap<Oura.Event> {
    return {
      Transaction: [this.updateTransactionBlockIfRequired.bind(this)],
    };
  }

  /**
   * Update an existing transaction setting block hash. It's also possible that
   * an existing transaction might contains a different block hash, in this case
   * the effect of this method is to update that transaction with this block hash.
   *
   * @param context transactional context
   * @param event oura event
   */
  private async updateTransactionBlockIfRequired(
    context: TransactionalContext,
    event: Oura.Event
  ) {
    if (Oura.isTransactionEvent(event)) {
      const {transaction: ouraTransaction} = event;

      const {hash: transactionHash} = ouraTransaction;

      const savedTransaction =
        await this.transactionRepository.getTransactionByTransactionHash(
          context,
          transactionHash
        );

      if (savedTransaction) {
        await this.transactionRepository.createIfNotExistBlockAndConnectTransaction(
          context,
          event.context,
          transactionHash
        );
      }
    }
  }
}
