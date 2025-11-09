import {inject, injectable} from 'tsyringe';

import {flow, isEmpty} from 'lodash';

import {TransactionalContext} from '~/domain/context';

import * as Oura from '~/domain/models/oura';

import {
  bigIntStringifyReplacer,
  ConfigService,
  LoggerService,
} from '~/domain/services';

import {ApplicationError} from '~/application/application.error';

import {TransactionRepository} from '~/domain/repositories';

import {
  appendUtxoRef,
  filterOutputsByOrderSwapNftPolicyIds,
  findNftPolicyIdInOutputWithRef,
  groupByNewOrderOrPartialFill,
  processOrderOutputDatum,
} from '~/implementation/event/oura/orderSwap/OrderSwapOpenAndPartialFillOuraEventHandler.utils';
import {ErrorCode} from '~/domain/errors';
import {OrderSwapScriptService} from '~/domain/services/orderSwapScript.service';
import {devStoreTransactionEvent} from '~/implementation/event/oura/orderSwap/utils';
import {SmartVaultApplication} from '~/smartVaultFeature/application/smartVault';

@injectable()
export class SmartVaultOpenAndDepositOuraEventHandler
  implements Oura.EventHandler
{
  orderSwapScriptVersion: string;
  orderSwapScriptPolicyIds: string[];
  orderSwapScriptAddresses: string[];

  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('LoggerService')
    private readonly loggerService: LoggerService,

    @inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,

    @inject('SmartVaultApplication')
    private readonly smartVaultApplication: SmartVaultApplication,

    @inject('OrderSwapScriptService')
    private readonly orderSwapScriptService: OrderSwapScriptService
  ) {
    this.orderSwapScriptVersion = 'V1';

    this.orderSwapScriptPolicyIds =
      this.orderSwapScriptService.getOrderSwapScriptPolicyIds(
        this.orderSwapScriptVersion
      );

    this.orderSwapScriptAddresses =
      this.orderSwapScriptService.getOrderSwapScriptAddresses(
        this.orderSwapScriptVersion
      );
  }

  getEventHandlerMap(): Oura.HandlerFunctionMap<Oura.Event> {
    return {
      Transaction: [this.transactionEventHandler.bind(this)],
      BlockEnd: [],
      RollBack: [],
    };
  }

  private async transactionEventHandler(
    context: TransactionalContext,
    event: Oura.Event
  ): Promise<void> {
    const {variant} = event;

    switch (variant) {
      case 'Transaction': {
        await this.handleTransactionEvent(context, event);
      }
    }
  }

  private async handleTransactionEvent(
    context: TransactionalContext,
    event: Oura.TransactionEvent
  ): Promise<void> {
    const {newOrders = [], partialFills = []} = flow([
      appendUtxoRef(event.transaction), // @IMPORTANT must be first to capture index correctly
      filterOutputsByOrderSwapNftPolicyIds(this.orderSwapScriptPolicyIds),
      groupByNewOrderOrPartialFill(event, this.orderSwapScriptPolicyIds),
    ])(event.transaction.outputs);

    if (!isEmpty(newOrders))
      devStoreTransactionEvent(
        this.configService.isDevelopmentEnvironment(),
        'handleOrderSwapOpenOnChainOuraEventHandler',
        event
      );

    if (!isEmpty(partialFills))
      devStoreTransactionEvent(
        this.configService.isDevelopmentEnvironment(),
        'handleOrderSwapPartialFillOnChainOuraEventHandler',
        event
      );

    if (!isEmpty(newOrders) || !isEmpty(partialFills))
      await this.transactionRepository.createTransactionIfNotExists(
        context,
        event.context,
        event.transaction
      );

    for (const output of newOrders) {
      await this.processNewOrderOutputs(context, event)(output);
    }

    // for (const output of partialFills) {
    //   await this.processPartialFillOutputs(context, event)(output);
    // }
  }

  private processNewOrderOutputs =
    (context: TransactionalContext, event: Oura.TransactionEvent) =>
    async (output: Oura.TransactionOutputWithRef) => {
      const orderSwapNftPolicyId = findNftPolicyIdInOutputWithRef(
        output,
        this.orderSwapScriptPolicyIds
      );

      if (!orderSwapNftPolicyId) {
        throw new ApplicationError(
          ErrorCode.NFT_POLICY_NOT_FOUND_IN_TRANSACTION_OUTPUT
        );
      }

      const result = await processOrderOutputDatum(
        event,
        orderSwapNftPolicyId,
        // We are attempting to get away from user in smart vaults and instead use walletStakeKeyHash
        ({walletStakeKeyHash}) => Promise.resolve(walletStakeKeyHash)
      )(output);
      if (result) {
        this.loggerService.info(
          `Smart Vault New Open: ${JSON.stringify(
            result,
            bigIntStringifyReplacer
          )}`
        );

        await this.smartVaultApplication.processSmartVaultOpenOnChain(
          context,
          event,
          output,
          // TODO: Temporary hacky code that needs to be reconsidered.
          // It was added because of how processing open orders for order swaps work.
          {...result, walletStakeKeyHash: result.userId}
        );
      } else {
        throw new ApplicationError(
          ErrorCode.ONCHAIN_EVENT__CRITICAL_FAILED_TO_PARSE_NEW_ORDER_OUTPUT,
          `TransactionHash: ${
            event.transaction.hash
          }, TransactionOutput ${JSON.stringify(output)}`
        );
      }
    };
}
