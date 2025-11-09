import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {PrismaClient} from '@prisma/client';

import {ConfigService} from '~/domain/services';

import {SmartVaultApplication} from '~/smartVaultFeature/application/smartVault';

import {AbstractQuery} from '~/implementation/fastify/abstract.query';

@singleton()
export class SmartVaultListQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject(SmartVaultApplication)
    private readonly smartVaultApplication: SmartVaultApplication
  ) {
    super(configService);
  }

  async listSmartVaults(
    req: FastifyRequest<{Querystring: Private.SmartVaultListQuery}>
  ): Promise<Private.PaginatedResults<Public.SmartVault>> {
    return this.smartVaultApplication.listSmartVaultsByStakeKeyHash(
      this.prisma,
      req.query
    );
  }

  async getSmartVaultById(
    req: FastifyRequest<{Params: {smartVaultId: string}}>
  ): Promise<Public.SmartVaultResult> {
    return this.smartVaultApplication.getSmartVaultById(
      this.prisma,
      req.params.smartVaultId
    );
  }

  async listSmartVaultOperationsById(
    req: FastifyRequest<{
      Params: {smartVaultId: string};
      Querystring: Private.SmartVaultOperationListQuery;
    }>
  ): Promise<Private.PaginatedResults<Public.SmartVaultOperation>> {
    return this.smartVaultApplication.listSmartVaultOperations(
      this.prisma,
      req.params.smartVaultId,
      req.query
    );
  }
}
