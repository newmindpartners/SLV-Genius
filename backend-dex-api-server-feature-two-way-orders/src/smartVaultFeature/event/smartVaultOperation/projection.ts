import {inject, injectable, singleton} from 'tsyringe';

import {EventStream, EventStreamProjection} from '~/domain/events';

import * as Prisma from '@prisma/client';

import {SmartVaultOperationReducer} from './reducer';
import {SmartVaultRepository} from '../../repository/smartVault';
import {SmartVaultEvent} from '../types';

@singleton()
@injectable()
export class SmartVaultOperationProjectionPrisma
  implements EventStreamProjection
{
  constructor(
    @inject('SmartVaultOperationReducer')
    private readonly smartVaultOperationReducer: SmartVaultOperationReducer,

    @inject('SmartVaultRepository')
    private readonly smartVaultRepository: SmartVaultRepository
  ) {}

  async handleWriteProjection(
    prisma: Prisma.Prisma.TransactionClient,
    event: SmartVaultEvent,
    eventStream: EventStream<SmartVaultEvent>
  ): Promise<void> {
    const aggregate = this.smartVaultOperationReducer.reduce(eventStream);

    await this.smartVaultRepository.createOrUpdateSmartVaultOperationProjection(
      prisma,
      aggregate
    );
  }
}
