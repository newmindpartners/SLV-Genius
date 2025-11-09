import 'reflect-metadata';

import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {
  AssetRepository,
  OrderSaleProjectRepository,
  OrderSaleRepository,
} from '~/domain/repositories';

import {CoreService, OrderService} from '~/domain/services';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';

import {ErrorCode} from '~/domain/errors/domain.error';
import {ApplicationError} from '~/application/application.error';

import {plus} from '~/domain/utils/math.util';
import {
  calcTransactionFeeServiceAmount,
  getProjectRoundInProject,
} from '~/domain/utils/project.util';

type OrderSaleTransactionFeeAndDepositAmount = {
  transactionFeeDepositAmount: string;
  transactionFeeAmount: string;
};

@singleton()
@injectable()
export class OrderSaleApplication {
  constructor(
    @inject('OrderSaleProjectRepository')
    protected readonly orderSaleProjectRepository: OrderSaleProjectRepository,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper,

    @inject('CoreService')
    private readonly coreService: CoreService,

    @inject('OrderService')
    private readonly orderService: OrderService,

    @inject('AssetRepository')
    private readonly assetRepository: AssetRepository,

    @inject('OrderSaleRepository')
    private readonly orderSaleRepository: OrderSaleRepository
  ) {}

  async getOrderSaleFee(
    context: TransactionalContext,
    orderData: Public.SaleOrderData,
    walletAccount: Public.WalletAccount
  ): Promise<Public.SaleOrderTotalFeesDeposit> {
    const {roundId} = orderData;

    const {orderSaleProject, orderSaleProjectRound} =
      await this.getOrderSaleProjectAndRoundByRoundId(context, roundId);
    const {feePercent: transactionFeeServicePercent} = orderSaleProject;

    const transactionFeeServiceAmount = calcTransactionFeeServiceAmount(
      orderData,
      orderSaleProject,
      orderSaleProjectRound
    );

    const {transactionFeeDepositAmount, transactionFeeAmount} =
      await this.getApproximatedOrderFeeAndDepositAmount(
        context,
        walletAccount,
        orderData
      );

    // compute transaction total costs amount
    const transactionTotalCostsAmount: string = plus(
      transactionFeeServiceAmount,
      transactionFeeAmount || 0,
      transactionFeeDepositAmount || 0
    ).toString();

    return {
      transactionFeeAmount,
      transactionFeeDepositAmount,
      transactionFeeServiceAmount,
      transactionTotalCostsAmount,
      transactionFeeServicePercent: transactionFeeServicePercent.toString(),
    };
  }

  async createOrderSaleOpen(
    context: TransactionalContext,
    user: Private.User,
    orderSaleData: Public.SaleOrderData,
    walletAccount: Public.WalletAccount
  ): Promise<Public.UnsignedSaleOrder> {
    const orderSaleReference = null;
    return await this.createOrderSale(
      context,
      user,
      walletAccount,
      orderSaleData,
      orderSaleReference,
      Private.OrderSaleTransactionType.OPEN
    );
  }

  async updateOrderSaleCancel(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    orderReference: Public.OrderReference
  ): Promise<Public.UnsignedSaleOrder> {
    const orderSale = await this.getOrderSale(context, orderReference);

    const {roundId} = orderSale;

    const {orderSaleProject, orderSaleProjectRound} =
      await this.getOrderSaleProjectAndRoundByRoundId(context, roundId);

    const adaAsset = await this.assetRepository.getAdaAsset(context);

    const publicOrderSale = this.domainMapper.toPublicOrderSale(
      adaAsset,
      orderSale,
      orderSaleProject,
      orderSaleProjectRound
    );

    return await this.createOrderSale(
      context,
      user,
      walletAccount,
      publicOrderSale,
      orderReference,
      Private.OrderSaleTransactionType.CANCEL
    );
  }

  protected async createOrderSale(
    context: TransactionalContext,
    user: Private.User,
    walletAccount: Public.WalletAccount,
    orderSaleData: Public.SaleOrderData,
    orderSaleReference: Public.OrderReference | null,
    unsignedOrderSaleTransactionType: Public.SaleOrderTransactionType
  ): Promise<Public.UnsignedSaleOrder> {
    const coreOrderSaleOpen = await this.coreOrderSaleOpenRequest(
      context,
      walletAccount,
      orderSaleData,
      orderSaleReference,
      unsignedOrderSaleTransactionType
    );

    const unsignedOrderSaleOpenTransaction =
      await this.coreService.orderSaleOpen(coreOrderSaleOpen);

    const unsignedOrderSaleOpen = this.toUnsignedOrderSaleOpen(
      orderSaleData,
      orderSaleReference,
      coreOrderSaleOpen,
      unsignedOrderSaleOpenTransaction
    );

    const savedOrderSale = await this.saveOrderSale(
      context,
      user,
      unsignedOrderSaleOpen,
      unsignedOrderSaleOpenTransaction,
      unsignedOrderSaleTransactionType
    );

    return savedOrderSale;
  }

  private async coreOrderSaleOpenRequest(
    context: TransactionalContext,
    walletAccount: Public.WalletAccount,
    orderSaleData: Public.SaleOrderData,
    orderSaleReference: Public.OrderReference | null,
    orderSaleTransactionType: Public.SaleOrderTransactionType
  ) {
    const coreOrderSaleOpenRequest: Core.OrderSaleOpenRequest =
      await this.toCoreOrderSaleOpenRequest(
        context,
        walletAccount,
        orderSaleData
      );

    const coreOrderSaleOpenRequestIfCancel: Core.OrderSaleRequest =
      await this.overrideCoreOrderRequestIfCancelOrder(
        context,
        orderSaleData,
        orderSaleReference,
        coreOrderSaleOpenRequest,
        orderSaleTransactionType
      );

    return {
      ...coreOrderSaleOpenRequest,
      ...coreOrderSaleOpenRequestIfCancel,
    };
  }

  private async overrideCoreOrderRequestIfCancelOrder(
    context: TransactionalContext,
    orderSaleData: Public.SaleOrderData,
    orderSaleReference: Public.OrderReference | null,
    coreOrderSaleRequest: Core.OrderSaleOpenRequest,
    orderSaleTransactionType: Public.SaleOrderTransactionType
  ): Promise<Core.OrderSaleRequest> {
    const isCancel =
      Private.OrderSaleTransactionType.CANCEL === orderSaleTransactionType;
    if (isCancel) {
      if (orderSaleReference) {
        return this.overrideCoreOrderCancelRequest(
          context,
          orderSaleData,
          orderSaleReference,
          coreOrderSaleRequest
        );
      } else {
        throw Error(ErrorCode.ORDER__TRANSACTION_REFERENCE_NOT_FOUND);
      }
    } else {
      return coreOrderSaleRequest;
    }
  }

  private async overrideCoreOrderCancelRequest(
    context: TransactionalContext,
    orderSaleData: Public.SaleOrderData,
    orderSaleReference: Public.OrderReference,
    coreOrderSaleRequest: Core.OrderSaleOpenRequest
  ): Promise<Core.OrderSaleCancelRequest> {
    const {roundId} = orderSaleData;
    const {orderId} = orderSaleReference;

    const scriptAddress = await this.getRoundScriptAddressByRoundId(
      context,
      roundId
    );

    const utxoReference =
      // this is because core service is expecting an internal order reference
      // composed by transactionOutput.txHash and transactionOutput.index
      // which are value not directly connected to an order, but to the open
      // event that was initially used to create that order and as an effect
      // to submit and store transaction information (input, output) in that
      await this.orderSaleRepository.getOrderSaleCancelReference(
        context,
        orderId,
        scriptAddress
      );

    return {
      ...coreOrderSaleRequest,
      utxoReference,
    };
  }

  private async getRoundScriptAddressByRoundId(
    context: TransactionalContext,
    saleProjectRoundId: string
  ) {
    const orderSaleProject =
      await this.orderSaleProjectRepository.getOrderSaleProjectByRoundId(
        context,
        saleProjectRoundId
      );

    if (!orderSaleProject) {
      throw new Error(ErrorCode.PROJECT_NOT_FOUND);
    }

    const saleProjectRound = getProjectRoundInProject(
      orderSaleProject,
      saleProjectRoundId
    );

    const {scriptAddress} = saleProjectRound;
    if (!scriptAddress)
      throw new ApplicationError(
        ErrorCode.INVALID_ROUND__SCRIPT_ADDRESS_REQUIRED
      );
    return scriptAddress;
  }

  private async saveOrderSale(
    context: TransactionalContext,
    user: Private.User,
    unsignedOrderSale: Public.UnsignedSaleOrder,
    unsignedOrderSaleOpenTransaction: Core.Transaction,
    unsignedOrderSaleTransactionType: Public.SaleOrderTransactionType
  ): Promise<Public.UnsignedSaleOrder> {
    switch (unsignedOrderSaleTransactionType) {
      case Private.OrderSaleTransactionType.OPEN: {
        const orderSaleOpen =
          await this.orderSaleRepository.createOrderSaleOpen(
            context,
            user,
            unsignedOrderSale,
            unsignedOrderSaleOpenTransaction
          );
        return this.domainMapper.toPublicUnsignedOrderSale(
          orderSaleOpen,
          unsignedOrderSale
        );
      }
      case Private.OrderSaleTransactionType.CANCEL: {
        const orderSaleCancel =
          await this.orderSaleRepository.createOrderSaleCancel(
            context,
            unsignedOrderSale,
            unsignedOrderSaleOpenTransaction
          );
        return this.domainMapper.toPublicUnsignedOrderSale(
          orderSaleCancel,
          unsignedOrderSale
        );
      }
      default:
      case Private.OrderSaleTransactionType.FILL:
        throw new ApplicationError(
          ErrorCode.ORDER__UNEXPECTED_TRANSACTION_TYPE_FILL
        );
    }
  }

  private async getOrderSale(
    context: TransactionalContext,
    orderReference: Public.OrderReference
  ): Promise<Private.OrderSale> {
    const {orderId} = orderReference;
    return await this.orderSaleRepository.getOrderSaleByOrderId(
      context,
      orderId
    );
  }

  private async getApproximatedOrderFeeAndDepositAmount(
    context: TransactionalContext,
    walletAccount: Public.WalletAccount,
    orderSaleData: Public.SaleOrderData
  ): Promise<OrderSaleTransactionFeeAndDepositAmount> {
    return await this.getExactOrderFeeAndDepositAmount(
      context,
      walletAccount,
      orderSaleData
    );
  }

  private async getExactOrderFeeAndDepositAmount(
    context: TransactionalContext,
    walletAccount: Public.WalletAccount,
    orderSaleData: Public.SaleOrderData
  ): Promise<OrderSaleTransactionFeeAndDepositAmount> {
    const coreOrderSaleRequest = await this.toCoreOrderSaleOpenRequest(
      context,
      walletAccount,
      orderSaleData
    );

    const coreCreateOrderSale = await this.coreService.orderSaleOpen(
      coreOrderSaleRequest
    );

    const {transactionFeeDepositAmount, transactionFeeAmount} =
      coreCreateOrderSale;

    if (transactionFeeAmount && transactionFeeDepositAmount) {
      return {transactionFeeDepositAmount, transactionFeeAmount};
    } else {
      throw new ApplicationError(
        ErrorCode.ORDER__TRANSACTION_FEE_DEPOSIT_AMOUNT_REQUIRED
      );
    }
  }

  /**
   * toCoreOrderSaleOpenRequest
   *
   * baseAssetAmount - core `offer` (base asset amount to purchase)
   * quoteAssetAmount - core `price` in ADA for 1 baseAsset
   *
   * @param context
   * @param walletAccount
   * @param orderSaleData
   * @returns Promise<CoreSaleOrderRequest>
   */
  private async toCoreOrderSaleOpenRequest(
    context: TransactionalContext,
    walletAccount: Public.WalletAccount,
    orderSaleData: Public.SaleOrderData
  ): Promise<Core.OrderSaleOpenRequest> {
    const {roundId} = orderSaleData;

    const {orderSaleProject, orderSaleProjectRound} =
      await this.getOrderSaleProjectAndRoundByRoundId(context, roundId);

    const {baseAssetAmount} = orderSaleData;

    const adaAsset = await this.assetRepository.getAdaAsset(context);

    const coreOrderSaleOpenRequest: Core.OrderSaleOpenRequest =
      this.orderService.toCoreOrderSaleOpenRequest(
        adaAsset,
        walletAccount,
        orderSaleProject,
        orderSaleProjectRound,
        baseAssetAmount
      );

    return coreOrderSaleOpenRequest;
  }

  private toUnsignedOrderSaleOpen(
    orderSaleData: Public.SaleOrderData,
    orderSaleReference: Public.OrderReference | null,
    coreOrderSaleOpenRequest: Core.OrderSaleOpenRequest,
    orderSaleOpenUnsignedTransaction: Public.UnsignedTransaction
  ): Public.UnsignedSaleOrder {
    const {roundId} = orderSaleData;

    const {baseAssetId, baseAssetAmount} = coreOrderSaleOpenRequest;
    const {quoteAssetId, quoteAssetAmount} = coreOrderSaleOpenRequest;
    const {transactionId, transactionPayload} =
      orderSaleOpenUnsignedTransaction;

    // transactionId is used when we create order, because core server doesn't return a transaction id, to track order and transaction we use that id
    const orderId = orderSaleReference?.orderId || transactionId;

    return {
      orderId,

      roundId,

      baseAssetId,
      quoteAssetId,
      baseAssetAmount,
      quoteAssetAmount,

      transactionId,
      transactionPayload,
    };
  }

  async updateOrderSaleProjectRoundAmountWithOrderSale(
    context: TransactionalContext,
    eventId: string
  ) {
    const orderSale = await this.orderSaleRepository.getOrderSaleByEventId(
      context,
      eventId
    );

    await this.orderSaleProjectRepository.updateOrderSaleProjectRoundAmountWithOrderSale(
      context,
      orderSale
    );
  }

  protected async getOrderSaleProjectAndRoundByRoundId(
    context: TransactionalContext,
    roundId: string
  ): Promise<{
    orderSaleProject: Private.OrderSaleProject;
    orderSaleProjectRound: Private.OrderSaleProjectRound;
  }> {
    const orderSaleProject = await this.getOrderSaleProjectByRoundId(
      context,
      roundId
    );

    if (!orderSaleProject) {
      throw new Error(ErrorCode.PROJECT_NOT_FOUND);
    }

    const orderSaleProjectRound = getProjectRoundInProject(
      orderSaleProject,
      roundId
    );

    return {orderSaleProject, orderSaleProjectRound};
  }

  private async getOrderSaleProjectByRoundId(
    context: TransactionalContext,
    roundId: string,
    walletStakeKeyHash?: string
  ): Promise<Private.OrderSaleProject | null> {
    return await this.orderSaleProjectRepository.getOrderSaleProjectByRoundId(
      context,
      roundId,
      walletStakeKeyHash
    );
  }
}
