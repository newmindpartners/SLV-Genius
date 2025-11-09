import {inject, injectable} from 'tsyringe';

import {find, map, reduce} from 'lodash';

import {TransactionalContext} from '~/domain/context';

import * as Private from '~/domain/models/private';
import * as Oura from '~/domain/models/oura';

import {ConfigService, LoggerService} from '~/domain/services';

import {
  OrderSwapRepository,
  TransactionRepository,
  UserRepository,
} from '~/domain/repositories';

import {OrderSwapApplication} from '~/application/orderSwap.application';

import {devStoreTransactionEvent} from './utils';

import {parseTransactionForFinalFillAndCancel} from './OrderSwapCancelAndFinalFillOuraEventHandler.utils';
import {isOnchainLimitOrderSwap} from '~/domain/models/private';
import {OrderSwapScriptService} from '~/domain/services/orderSwapScript.service';
import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';

type OrderSwapWithInputIndex = Private.OrderSwap & {inputIndex: number};

@injectable()
export class OrderSwapCancelAndFinalFillOuraEventHandler
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

    @inject('OrderSwapRepository')
    private readonly orderSwapRepository: OrderSwapRepository,

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
        this.handleOrderSwapCancelAndFinalFillOnChainOuraEventHandler.bind(
          this
        ),
      ],
      BlockEnd: [],
      RollBack: [],
    };
  }

  private async handleOrderSwapCancelAndFinalFillOnChainOuraEventHandler(
    context: TransactionalContext,
    event: Oura.Event
  ): Promise<void> {
    const {variant} = event;

    switch (variant) {
      case 'Transaction': {
        await this.handleOrderSwapCancelAndFinalFillTransaction(context, event);
      }
    }
  }

  private async handleOrderSwapCancelAndFinalFillTransaction(
    context: TransactionalContext,
    event: Oura.TransactionEvent
  ): Promise<void> {
    const result = await parseTransactionForFinalFillAndCancel(
      event,
      this.orderSwapScriptPolicyIds,
      this.getOrderSwapsByMintAssetId(context),
      this.loggerService
    );

    if (result) {
      const {cancelledOrders, finalFillOrders, unknownOrders} = result;

      if (cancelledOrders)
        devStoreTransactionEvent(
          this.configService.isDevelopmentEnvironment(),
          'handleOrderSwapCancelOnChainOuraEventHandler',
          event
        );

      if (finalFillOrders)
        devStoreTransactionEvent(
          this.configService.isDevelopmentEnvironment(),
          'handleOrderSwapFinalFillOnChainOuraEventHandler',
          event
        );

      if (unknownOrders)
        throw new ApplicationError(
          ErrorCode.ONCHAIN_EVENT__CRITICAL_FAILED_TO_CATEGORIZE_BURN
        );

      if (cancelledOrders || finalFillOrders)
        await this.transactionRepository.createTransactionIfNotExists(
          context,
          event.context,
          event.transaction
        );

      await Promise.all(
        map(cancelledOrders, this.processCancelledOrders(context, event))
      );
      await Promise.all(
        map(finalFillOrders, this.processFinalFillOrders(context, event))
      );
    }
  }

  private processCancelledOrders =
    (context: TransactionalContext, event: Oura.TransactionEvent) =>
    async (orderSwap: OrderSwapWithInputIndex) => {
      this.loggerService.info(`Order Swap Cancelled: ${orderSwap.orderSwapId}`);

      if (isOnchainLimitOrderSwap(orderSwap))
        await this.orderSwapApplication.createOrUpdateOrderSwapCancellation(
          context,
          event,
          orderSwap
        );
    };

  private processFinalFillOrders =
    (context: TransactionalContext, event: Oura.TransactionEvent) =>
    async (orderSwap: OrderSwapWithInputIndex) => {
      this.loggerService.info(
        `Order Swap Final fill: ${orderSwap.orderSwapId}`
      );

      if (isOnchainLimitOrderSwap(orderSwap))
        await this.orderSwapApplication.createOrUpdateOrderSwapFinalFill(
          context,
          event,
          orderSwap
        );
    };

  /**
   * Curried getOrderSwapsByMintAssetId
   * Return record with keys of the original ids to identify fail to finds
   */
  private getOrderSwapsByMintAssetId =
    (context: TransactionalContext) => async (mintAssetIds: string[]) => {
      const orderSwaps =
        await this.orderSwapRepository.getOrderSwapsByMintAssetId(
          context,
          mintAssetIds
        );

      const orderSwapRecord = reduce(
        mintAssetIds,
        (result, transactionMintAssetId) => ({
          ...result,
          [transactionMintAssetId]: find(
            orderSwaps,
            orderSwap => orderSwap.mintAssetId === transactionMintAssetId
          ),
        }),
        {}
      );

      return orderSwapRecord;
    };
}
