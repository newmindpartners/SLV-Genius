import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Public from '~/domain/models/public';

import {
  OrderSaleProjectRepository,
  OrderSaleRepository,
} from '~/domain/repositories';

import {TransactionSubmitOrPostProcessHandler} from './transactionSubmitOrPostProcessHandler';

@singleton()
@injectable()
export class TransactionPostSubmitHandlerOrderSale
  implements
    TransactionSubmitOrPostProcessHandler<
      Public.SignedTransaction,
      Public.SignedTransaction
    >
{
  constructor(
    @inject('OrderSaleRepository')
    private readonly orderSaleRepository: OrderSaleRepository,

    @inject('OrderSaleProjectRepository')
    private readonly orderSaleProjectRepository: OrderSaleProjectRepository
  ) {}

  async handleTransaction(
    context: TransactionalContext,
    signedTransaction: Public.SignedTransaction
  ): Promise<Public.SignedTransaction> {
    const {transactionId: eventId} = signedTransaction;

    const orderSale = await this.orderSaleRepository.getOrderSaleByEventId(
      context,
      eventId
    );

    await this.orderSaleProjectRepository.updateOrderSaleProjectRoundAmountWithOrderSale(
      context,
      orderSale
    );

    return signedTransaction;
  }
}
