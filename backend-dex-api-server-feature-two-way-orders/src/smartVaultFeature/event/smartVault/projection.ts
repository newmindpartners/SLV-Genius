import {inject, injectable, singleton} from 'tsyringe';

import {EventStream, EventStreamProjection} from '~/domain/events';

import * as Prisma from '@prisma/client';

import {SmartVaultReducer} from './reducer';
import {SmartVaultRepository} from '../../repository/smartVault';
import {SmartVaultEvent} from '../types';

@singleton()
@injectable()
export class SmartVaultProjectionPrisma implements EventStreamProjection {
  constructor(
    @inject('SmartVaultReducer')
    private readonly smartVaultReducer: SmartVaultReducer,

    @inject('SmartVaultRepository')
    private readonly smartVaultRepository: SmartVaultRepository
  ) {}

  async handleWriteProjection(
    prisma: Prisma.Prisma.TransactionClient,
    event: SmartVaultEvent,
    eventStream: EventStream<SmartVaultEvent>
  ): Promise<void> {
    const aggregate = this.smartVaultReducer.reduce(eventStream);

    await this.smartVaultRepository.createOrUpdateSmartVaultProjection(
      prisma,
      aggregate
    );
  }
}
