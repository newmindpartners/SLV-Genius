import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {PrismaClient} from '@prisma/client';

import * as Public from '~/domain/models/public';

import {ConfigService} from '~/domain/services';

import {OrderSwapApplication} from '~/application/orderSwap.application';

import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';

import {ErrorCode} from '~/domain/errors';

import {ApplicationError} from '~/application/application.error';

@singleton()
export class OrderSwapMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject(OrderSwapApplication)
    private readonly orderSwapApplication: OrderSwapApplication
  ) {
    super(configService);
  }

  async openOrderSwap({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.OpenSwapOrder;
  }>): Promise<Public.UnsignedTransaction | Error> {
    const {
      walletAddress,
      collateralUtxo,
      walletRewardAddresses,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = body;

    const wallet: Public.WalletAccount = {
      walletAddress,
      collateralUtxo,
      walletUsedAddresses,
      walletUnusedAddresses,
      walletRewardAddresses,
    };

    const {
      orderType,
      toAssetId,
      fromAssetId,
      toAssetAmount,
      fromAssetAmount,
      effectiveFromDate,
      effectiveUntilDate,
      fillFromAssetCount,
    } = body;

    const orderData: Public.SwapOrderData = {
      orderType,
      toAssetId,
      fromAssetId,
      toAssetAmount,
      fromAssetAmount,
      effectiveFromDate,
      effectiveUntilDate,
      fillFromAssetCount,
    };

    if (user) {
      return await this.prisma.$transaction(
        async prisma =>
          this.orderSwapApplication.createOrderSwapOpenInit(
            prisma,
            user,
            wallet,
            orderData
          ),
        this.configService.getPrismaTransactionOptions()
      );
    } else {
      throw new ApplicationError(ErrorCode.ORDER__USER_NOT_ATTACHED_TO_REQUEST);
    }
  }

  async fillOrderSwaps({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.FillSwapOrders;
  }>): Promise<Public.UnsignedTransaction | Error> {
    if (!user) {
      throw new ApplicationError(ErrorCode.ORDER__USER_NOT_ATTACHED_TO_REQUEST);
    }

    const {fillSwapOrders, orderFillType} = body;

    const fillOrders = fillSwapOrders;

    const {
      walletAddress,
      collateralUtxo,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = body;

    const wallet: Public.WalletAccount = {
      walletAddress,
      collateralUtxo,
      walletUsedAddresses,
      walletUnusedAddresses,
    };

    return await this.prisma.$transaction(async prisma => {
      const result = await this.orderSwapApplication.createOrderSwapFillInit(
        prisma,
        user,
        wallet,
        orderFillType,
        fillOrders
      );
      return result;
    }, this.configService.getPrismaTransactionOptions());
  }

  async cancelOrderSwap({
    user,
    body,
    params: orderReference,
  }: FastifyRequest<{
    Body: Public.WalletAccount;
    Params: Public.OrderReference;
  }>): Promise<Public.UnsignedTransaction | Error> {
    const wallet = body;

    if (user) {
      return await this.prisma.$transaction(
        async prisma =>
          this.orderSwapApplication.updateOrderSwapCancel(
            prisma,
            user,
            wallet,
            orderReference
          ),
        this.configService.getPrismaTransactionOptions()
      );
    } else {
      throw new ApplicationError(ErrorCode.ORDER__USER_NOT_ATTACHED_TO_REQUEST);
    }
  }
}
