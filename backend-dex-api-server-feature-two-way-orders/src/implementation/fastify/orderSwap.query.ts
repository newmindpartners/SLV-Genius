import {AbstractQuery} from '~/implementation/fastify/abstract.query';

import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {PrismaClient} from '@prisma/client';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {ConfigService} from '~/domain/services';

import {OrderSwapApplication} from '~/application/orderSwap.application';

import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';

@singleton()
export class OrderSwapQueryFastify extends AbstractQuery {
  constructor(
    @inject('PrismaClient')
    readonly prisma: PrismaClient,

    @inject('ConfigService')
    readonly configService: ConfigService,

    @inject(OrderSwapApplication)
    readonly orderSwapApplication: OrderSwapApplication
  ) {
    super(configService);
  }

  async getOrderSwapOpenFee({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.OpenSwapOrder;
  }>): Promise<Public.SwapOrderMakerTotalFeesDeposit> {
    const wallet: Public.WalletAccount = body;
    const orderData: Public.SwapOrderData = body;

    if (user) {
      return await this.orderSwapApplication.getOrderSwapOpenFee(
        this.prisma,
        orderData,
        wallet
      );
    } else {
      throw new ApplicationError(ErrorCode.ORDER__USER_NOT_ATTACHED_TO_REQUEST);
    }
  }

  async getOrderSwapFillFee({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.FillSwapOrders;
  }>): Promise<Public.SwapOrderTakerTotalFees> {
    if (!user) {
      throw new ApplicationError(ErrorCode.ORDER__USER_NOT_ATTACHED_TO_REQUEST);
    }

    const fillOrders = body.fillSwapOrders;

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

    return await this.orderSwapApplication.getOrderSwapFillFee(
      this.prisma,
      wallet,
      fillOrders
    );
  }

  async listOrdersSwap({
    user,
    query,
  }: FastifyRequest<{
    Querystring: Private.OrderSwapQuery;
  }>): Promise<Private.PaginatedResults<Public.SwapOrder>> {
    /**
     * `filterByOwner` is a deprecated way of filtering order swaps created by the user.
     * `filterByWalletStakeKeyHash` is the new way of filtering as this allows for more
     * flexible filtering of order swaps created by any user.
     *
     * The API is not intended to be used with both these filtering options passed, and
     * therefore we will prevent any such attempts by throwing an error.
     */
    if (query.filterByOwner && query.filterByWalletStakeKeyHash) {
      throw new Error(ErrorCode.ORDER__FILTER_BY_WALLET_AND_OWNER);
    }

    const userWalletStakeKeyHash = user?.walletStakeKeyHash;

    return this.orderSwapApplication.listOrderSwaps(
      this.prisma,
      query,
      userWalletStakeKeyHash
    );
  }

  async getOrderSwapBestAvailable({
    user,
    query,
  }: FastifyRequest<{
    Querystring: Private.OrderSwapBestAvailableQuery;
  }>): Promise<Public.BestAvailableSwapOrderResults> {
    const walletStakeKeyHash = user?.walletStakeKeyHash;
    return this.orderSwapApplication.getOrderSwapBestAvailable(
      this.prisma,
      query,
      walletStakeKeyHash
    );
  }
}
