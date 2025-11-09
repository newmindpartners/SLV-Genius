import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Oura from '~/domain/models/oura';

import {
  OrderSaleRepository,
  OrderSaleProjectRepository,
} from '~/domain/repositories';

import {TransactionService} from '~/domain/services';

@singleton()
@injectable()
export class OrderSaleFillOuraEventHandler implements Oura.EventHandler {
  constructor(
    @inject('TransactionService')
    private transactionService: TransactionService,

    @inject('OrderSaleRepository')
    private orderSaleRepository: OrderSaleRepository,

    @inject('OrderSaleProjectRepository')
    private orderSaleProjectRepository: OrderSaleProjectRepository
  ) {}

  getEventHandlerMap(): Oura.HandlerFunctionMap<Oura.Event> {
    return {
      Transaction: [this.updateFillTransactionIfRequired.bind(this)],
    };
  }

  /**
   * Identify a fill transaction and update existing order sale / event and transaction table
   * accordingly. This actually implement the logic to update order status with a fill order
   * event, providing necessary information to compute filled base amount and order status.
   *
   * This function is implemented in this way:
   *
   * 1) get a list of projects' base assets, because these information are used mainly to
   *      identify a fill order.
   *
   * 2) verify if this transaction is a fill transaction, if one of the projects' asset is
   *      in the transaction then this is a fill transaction. Actually a simple rule, which
   *      is really couple with token sale place order and distribution design.
   *
   * 3) update orders properly with that fill transaction, as effect of this update a fill
   *      event is added to that order sale. Public.Transaction input / output should already exists
   *      because we create these table rows on open order. Secondary effect which is required
   *      by database model is to create a transaction table row for that fill transaction and
   *      reference existing transaction input / output row to keep datamodel consistent.
   *
   * Most of the logic of this function is to lookup existing data in the database, select
   * appropriate order sale, and create a fill event. Part of this process require also to
   * use user wallet stake key hash that is the information used to identify that a transaction
   * output is related to an order created by an user.
   *
   * @param context
   * @param event
   */
  private async updateFillTransactionIfRequired(
    context: TransactionalContext,
    event: Oura.Event
  ) {
    if (Oura.isTransactionEvent(event)) {
      const {transaction: ouraTransaction, context: eventContext} = event;

      const baseAssets =
        await this.orderSaleProjectRepository.getProjectBaseAssets(context);

      const scriptAddresses =
        await this.orderSaleProjectRepository.getProjectScriptAddresses(
          context
        );

      const isFillTransaction = await this.transactionService.isFillTransaction(
        context,
        baseAssets,
        scriptAddresses,
        ouraTransaction
      );

      if (isFillTransaction) {
        await this.orderSaleRepository.updateFillTransactionOrders(
          context,
          eventContext,
          ouraTransaction
        );
      }
    }
  }
}
