import {AbstractQuery} from '~/implementation/fastify/abstract.query';

import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {PrismaClient} from '@prisma/client';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {ConfigService} from '~/domain/services';
import {TradingWalletApplication} from '~/application/tradingWallet.application';

@singleton()
export class TradingWalletQueryFastify extends AbstractQuery {
  constructor(
    @inject('PrismaClient')
    readonly prisma: PrismaClient,

    @inject('ConfigService')
    readonly configService: ConfigService,

    @inject('TradingWalletApplication')
    readonly tradingWalletApplication: TradingWalletApplication
  ) {
    super(configService);
  }

  async listTradingWallets({
    query,
  }: FastifyRequest<{
    Querystring: Private.TradingWalletListQuery;
  }>): Promise<Private.PaginatedResults<Public.TradingWallet>> {
    return this.tradingWalletApplication.listTradingWallets(this.prisma, query);
  }

  async getTradingWallet({
    params,
  }: FastifyRequest<{
    Params: Private.TradingWalletQuery;
  }>): Promise<Public.TradingWallet> {
    return this.tradingWalletApplication.getTradingWallet(this.prisma, params);
  }
}
