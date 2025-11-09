import 'reflect-metadata';

import {inject, injectable, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';

import {TransactionalContext} from '~/domain/context';
import {SmartVaultStrategyRepository} from '../repository/smartVaultStrategy';
import {DomainMapper} from '~/implementation/prisma/domain.mapper';

@singleton()
@injectable()
export class SmartVaultStrategyApplication {
  constructor(
    @inject('SmartVaultStrategyRepository')
    private readonly smartVaultStrategyRepository: SmartVaultStrategyRepository,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper
  ) {}

  async listSmartVaultStrategies(
    context: TransactionalContext
  ): Promise<Public.SmartVaultStrategy[]> {
    const smartVaultStrategies =
      await this.smartVaultStrategyRepository.listSmartVaultStrategies(context);

    return smartVaultStrategies.map(
      this.domainMapper.toPublicSmartVaultStrategy
    );
  }
}
