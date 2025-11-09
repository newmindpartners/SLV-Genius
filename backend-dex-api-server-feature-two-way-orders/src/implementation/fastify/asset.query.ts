import {AbstractQuery} from '~/implementation/fastify/abstract.query';

import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {PrismaClient} from '@prisma/client';
import * as Public from '~/domain/models/public';

import {ConfigService} from '~/domain/services';

import {AssetApplication} from '~/application/asset.application';

@singleton()
export class AssetQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    readonly configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject('AssetApplication')
    readonly assetApplication: AssetApplication
  ) {
    super(configService);
  }

  async getAssetCirculatingSupply(
    req: FastifyRequest<{Params: {assetId: string}}>
  ): Promise<Public.CirculatingSupply> {
    const {assetId} = req.params;
    return this.assetApplication.getAssetCirculatingSupply(
      this.prisma,
      assetId
    );
  }
}
