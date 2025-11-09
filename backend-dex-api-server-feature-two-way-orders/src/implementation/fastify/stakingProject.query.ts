import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {PrismaClient} from '@prisma/client';

import {ConfigService} from '~/domain/services';

import {AbstractQuery} from '~/implementation/fastify/abstract.query';
import {StakingProjectApplication} from '~/application/stakingProject.application';

@singleton()
export class StakingProjectQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService') configService: ConfigService,
    @inject('PrismaClient') private readonly prisma: PrismaClient,
    @inject(StakingProjectApplication)
    private readonly stakingProjectApplication: StakingProjectApplication
  ) {
    super(configService);
  }

  async listStakingProjects(
    req: FastifyRequest<{Querystring: Private.StakingProjectsQuery}>
  ): Promise<Private.PaginatedResults<Public.StakingProject>> {
    return this.stakingProjectApplication.listStakingProjects(
      this.prisma,
      req.query
    );
  }

  async listStakingProjectNfts(
    req: FastifyRequest<{
      Params: {stakingProjectId: string};
      Body: Private.StakingProjectNftsQuery;
    }>
  ): Promise<Private.PaginatedResults<Public.StakingNft>> {
    return this.stakingProjectApplication.listStakingProjectNfts(
      this.prisma,
      req.params.stakingProjectId,
      req.body.walletBalance
    );
  }
}
