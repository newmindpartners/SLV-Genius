import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {PrismaClient} from '@prisma/client';

import {
  OpenSaleOrder,
  OrderReference,
  SaleOrderData,
  UnsignedSaleOrder,
  WalletAccount,
} from '~/domain/models/public';

import {OrderSaleApplication} from '~/application/orderSale.application';

import {ConfigService} from '~/domain/services';

import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';

import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';

@singleton()
export class OrderSaleMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject(OrderSaleApplication)
    private readonly orderSaleApplication: OrderSaleApplication
  ) {
    super(configService);
  }

  async orderCreate(
    req: FastifyRequest<{Body: OpenSaleOrder}>
  ): Promise<UnsignedSaleOrder> {
    const {user, body} = req;

    const wallet: WalletAccount = body;
    const saleOrder: SaleOrderData = body;

    if (user) {
      return await this.prisma.$transaction(
        async prisma =>
          this.orderSaleApplication.createOrderSaleOpen(
            prisma,
            user,
            saleOrder,
            wallet
          ),
        this.configService.getPrismaTransactionOptions()
      );
    } else {
      throw new ApplicationError(ErrorCode.ORDER__USER_NOT_ATTACHED_TO_REQUEST);
    }
  }

  async orderCancel(
    req: FastifyRequest<{Body: WalletAccount; Params: OrderReference}>
  ): Promise<UnsignedSaleOrder> {
    const {user, body, params: orderReference} = req;

    const wallet = body;

    if (user) {
      return await this.prisma.$transaction(
        async prisma =>
          this.orderSaleApplication.updateOrderSaleCancel(
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
