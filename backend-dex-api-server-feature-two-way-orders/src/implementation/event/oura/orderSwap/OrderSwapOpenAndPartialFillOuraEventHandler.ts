import {inject, injectable} from 'tsyringe';

import {flow, isEmpty} from 'lodash';

import {TransactionalContext} from '~/domain/context';

import * as Core from '~/domain/models/core';
import * as Oura from '~/domain/models/oura';

import {
  bigIntStringifyReplacer,
  ConfigService,
  LoggerService,
} from '~/domain/services';

import {ApplicationError} from '~/application/application.error';

import {TransactionRepository, UserRepository} from '~/domain/repositories';

import {OrderSwapApplication} from '~/application/orderSwap.application';

import {
  appendUtxoRef,
  filterOutputsByOrderSwapNftPolicyIds,
  findNftPolicyIdInOutputWithRef,
  groupByNewOrderOrPartialFill,
  processOrderOutputDatum,
} from './OrderSwapOpenAndPartialFillOuraEventHandler.utils';
import {ErrorCode} from '~/domain/errors';
import {devStoreTransactionEvent} from './utils';
import {OrderSwapScriptService} from '~/domain/services/orderSwapScript.service';

@injectable()
export class OrderSwapOpenAndPartialFillOuraEventHandler
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

    @inject('UserRepository')
    private readonly userRepository: UserRepository,

    @inject('OrderSwapApplication')
    private readonly orderSwapApplication: OrderSwapApplication,

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
      Transaction: [
        this.handleOrderSwapOpenAndPartialFillOnChainOuraEventHandler.bind(
          this
        ),
      ],
      BlockEnd: [],
      RollBack: [],
    };
  }

  private async handleOrderSwapOpenAndPartialFillOnChainOuraEventHandler(
    context: TransactionalContext,
    event: Oura.Event
  ): Promise<void> {
    const {variant} = event;

    switch (variant) {
      case 'Transaction': {
        await this.handleOrderSwapNewOrderAndPartialFillTransaction(
          context,
          event
        );
      }
    }
  }

  private async handleOrderSwapNewOrderAndPartialFillTransaction(
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

    for (const output of partialFills) {
      await this.processPartialFillOutputs(context, event)(output);
    }
  }

  private processNewOrderOutputs =
    (context: TransactionalContext, event: Oura.TransactionEvent) =>
    async (output: Oura.TransactionOutputWithRef) => {
      const {utxoReferenceTransactionHash, utxoReferenceIndex} = output;
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
        this.getUserId(context)
      )(output);
      if (result) {
        const {
          userId,
          mintAssetId,
          baseAssetId,
          baseAssetAmountTotalRemaining,
          quoteAssetId,
          quoteAssetAmountTotalRemaining,
          effectiveFromDate,
          effectiveUntilDate,
          partialFillsCount,
          price,
          priceRatio,
          makerLovelaceFlatFeeAmount,
          makerQuoteAssetFeeAmount,
          takerLovelaceFlatFeeAmount,
        } = result;

        this.loggerService.info(
          `Order Swap New Order: ${JSON.stringify(
            result,
            bigIntStringifyReplacer
          )}`
        );

        await this.orderSwapApplication.createOrUpdateOrderSwapOpenOnChain(
          context,
          event,
          userId,
          mintAssetId,
          baseAssetId,
          baseAssetAmountTotalRemaining,
          quoteAssetId,
          quoteAssetAmountTotalRemaining,
          utxoReferenceTransactionHash,
          utxoReferenceIndex,
          partialFillsCount,
          effectiveFromDate,
          effectiveUntilDate,
          price,
          priceRatio,
          makerLovelaceFlatFeeAmount,
          makerQuoteAssetFeeAmount,
          takerLovelaceFlatFeeAmount
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

  private processPartialFillOutputs =
    (context: TransactionalContext, event: Oura.TransactionEvent) =>
    async (output: Oura.TransactionOutputWithRef) => {
      const {utxoReferenceTransactionHash, utxoReferenceIndex} = output;
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
        this.getUserId(context)
      )(output);

      if (result) {
        const {
          userId,
          mintAssetId,
          baseAssetId,
          baseAssetAmountTotalRemaining,
          quoteAssetId,
          quoteAssetAmountTotalRemaining,
          effectiveFromDate,
          effectiveUntilDate,
          partialFillsCount,
          price,
          priceRatio,
        } = result;

        this.loggerService.info(
          `Order Swap Partial Fill: ${JSON.stringify(
            result,
            bigIntStringifyReplacer
          )}`
        );

        await this.orderSwapApplication.createOrUpdateOrderSwapPartialFill(
          context,
          event,
          userId,
          mintAssetId,
          baseAssetId,
          baseAssetAmountTotalRemaining,
          quoteAssetId,
          quoteAssetAmountTotalRemaining,
          utxoReferenceTransactionHash,
          utxoReferenceIndex,
          partialFillsCount,
          effectiveFromDate,
          effectiveUntilDate,
          price,
          priceRatio
        );
      } else {
        throw new ApplicationError(
          ErrorCode.ONCHAIN_EVENT__CRITICAL_FAILED_TO_PARSE_PARTIAL_FILL_OUTPUT,
          `TransactionHash: ${
            event.transaction.hash
          }, TransactionOutput ${JSON.stringify(output)}`
        );
      }
    };

  private getUserId =
    (context: TransactionalContext) =>
    async ({
      walletStakeKeyHash,
    }: Core.OrderSwapDatum): Promise<string | null> => {
      return walletStakeKeyHash
        ? (
            await this.userRepository.getOrCreateUserWithStakeKeyHash(
              context,
              walletStakeKeyHash
            )
          ).userId
        : null;
    };
}
