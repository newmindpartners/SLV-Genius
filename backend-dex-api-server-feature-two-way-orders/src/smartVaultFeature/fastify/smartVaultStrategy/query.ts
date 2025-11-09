import {inject, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';

import {PrismaClient} from '@prisma/client';

import {ConfigService} from '~/domain/services';

import {AbstractQuery} from '~/implementation/fastify/abstract.query';
import {SmartVaultStrategyApplication} from '~/smartVaultFeature/application/smartVaultStrategy';

@singleton()
export class SmartVaultStrategyQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject(SmartVaultStrategyApplication)
    private readonly smartVaultStrategyApplication: SmartVaultStrategyApplication
  ) {
    super(configService);
  }

  async listStrategies(): Promise<Public.SmartVaultStrategyListResult> {
    return this.smartVaultStrategyApplication.listSmartVaultStrategies(
      this.prisma
    );
  }
}
