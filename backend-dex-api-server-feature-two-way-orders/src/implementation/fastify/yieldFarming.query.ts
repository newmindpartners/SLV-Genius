import {inject, singleton} from 'tsyringe';

import {FastifyRequest} from 'fastify';

import {ConfigService} from '~/domain/services';

import {AbstractQuery} from '~/implementation/fastify/abstract.query';

import {YieldFarmingApplication} from '~/application/yieldFarming.application';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';
import {PrismaClient} from '@prisma/client';

@singleton()
export class YieldFarmingQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject('YieldFarmingApplication')
    private readonly yieldFarmingApplication: YieldFarmingApplication
  ) {
    super(configService);
  }

  async listRewards({
    user,
    query,
  }: FastifyRequest<{
    Querystring: Private.YieldFarmingRewardsQuery;
  }>): Promise<Public.YieldFarmingRewardsResult> {
    if (user) {
      return this.yieldFarmingApplication.listRewards(this.prisma, user, query);
    } else {
      throw new ApplicationError(
        ErrorCode.YIELD_FARMING__USER_NOT_ATTACHED_TO_REQUEST
      );
    }
  }
}
