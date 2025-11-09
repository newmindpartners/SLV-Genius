import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {AbstractQuery} from '~/implementation/fastify/abstract.query';

import {PrismaClient} from '@prisma/client';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {ConfigService} from '~/domain/services';

import {LiquidityPoolApplication} from '~/application/liquidityPool.application';

@singleton()
export class LiquidityPoolQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject(LiquidityPoolApplication)
    private readonly liquidityPoolApplication: LiquidityPoolApplication
  ) {
    super(configService);
  }

  async getLiquidityPool(
    req: FastifyRequest<{Params: {liquidityPoolId: string}}>
  ): Promise<Public.LiquidityPool> {
    const {liquidityPoolId} = req.params;
    return this.liquidityPoolApplication.getLiquidityPool(
      this.prisma,
      liquidityPoolId
    );
  }

  async getLiquidityPoolByAssets(
    req: FastifyRequest<{Params: {assetPair: string}}>
  ): Promise<Public.LiquidityPool> {
    const {assetPair} = req.params;
    const assetIds = assetPair.split('-');
    return this.liquidityPoolApplication.getLiquidityPoolByAssets(
      this.prisma,
      assetIds
    );
  }

  async listLiquidityPools(
    req: FastifyRequest<{Querystring: Private.LiquidityPoolQuery}>
  ): Promise<Private.PaginatedResults<Public.LiquidityPool>> {
    const {query} = req;
    return this.liquidityPoolApplication.listLiquidityPools(this.prisma, query);
  }
}
