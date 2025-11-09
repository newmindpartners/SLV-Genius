import {inject, singleton} from 'tsyringe';

import {ConfigService} from '~/domain/services';

import {AbstractQuery} from '~/implementation/fastify/abstract.query';

import * as Public from '~/domain/models/public';

import {PrismaClient} from '@prisma/client';
import {TradingPairApplication} from '~/application/tradingPair.application';

@singleton()
export class TradingPairQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject('TradingPairApplication')
    private readonly TradingPairApplication: TradingPairApplication
  ) {
    super(configService);
  }

  async listTradingPairs(): Promise<Public.TradingPairsResults> {
    return this.TradingPairApplication.listTradingPairs(this.prisma);
  }
}
