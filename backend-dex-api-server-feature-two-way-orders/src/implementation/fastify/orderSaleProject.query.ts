import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {AbstractQuery} from '~/implementation/fastify/abstract.query';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {PrismaClient} from '@prisma/client';

import {ConfigService} from '~/domain/services';

import {OrderSaleProjectApplication} from '~/application/orderSaleProject.application';

@singleton()
export class OrderSaleProjectQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject(OrderSaleProjectApplication)
    private readonly orderSaleProjectApplication: OrderSaleProjectApplication
  ) {
    super(configService);
  }

  async getOrderSaleProject(
    req: FastifyRequest<{Params: {orderSaleProjectId: string}}>
  ): Promise<Public.OrderSaleProject> {
    return this.orderSaleProjectApplication.getUserOrderSaleProject(
      this.prisma,
      req.user,
      req.params.orderSaleProjectId
    );
  }

  async listPortfolio(
    req: FastifyRequest<{Querystring: Private.OrderSalePortfolioQuery}>
  ): Promise<Private.PaginatedResults<Public.OrderSalePortfolioProject>> {
    return this.orderSaleProjectApplication.listPortfolioProjects(
      this.prisma,
      req.query
    );
  }

  async listOrderSaleProjects(
    req: FastifyRequest<{Querystring: Private.OrderSalePortfolioQuery}>
  ): Promise<Private.PaginatedResults<Public.OrderSaleProject>> {
    return this.orderSaleProjectApplication.listUserOrderSaleProjects(
      this.prisma,
      req.user,
      req.query
    );
  }
}
