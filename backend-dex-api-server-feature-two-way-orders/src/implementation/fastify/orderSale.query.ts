import {AbstractQuery} from '~/implementation/fastify/abstract.query';

import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {
  OpenSaleOrder,
  SaleOrderData,
  TransactionFee,
  WalletAccount,
} from '~/domain/models/public';

import {PrismaClient} from '@prisma/client';

import {ConfigService} from '~/domain/services';

import {OrderSaleApplication} from '~/application/orderSale.application';

@singleton()
export class OrderSaleQueryFastify extends AbstractQuery {
  constructor(
    @inject('PrismaClient')
    readonly prisma: PrismaClient,

    @inject('ConfigService')
    readonly configService: ConfigService,

    @inject(OrderSaleApplication)
    readonly orderApplication: OrderSaleApplication
  ) {
    super(configService);
  }

  async orderFee(
    req: FastifyRequest<{Body: OpenSaleOrder}>
  ): Promise<TransactionFee> {
    return await this.orderApplication.getOrderSaleFee(
      this.prisma,
      <SaleOrderData>req.body,
      <WalletAccount>req.body
    );
  }
}
