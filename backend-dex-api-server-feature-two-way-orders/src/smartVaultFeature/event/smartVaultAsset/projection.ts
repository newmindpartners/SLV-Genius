import {inject, injectable, singleton} from 'tsyringe';

import {EventStream, EventStreamProjection} from '~/domain/events';

import * as Prisma from '@prisma/client';

import {SmartVaultAssetReducer} from './reducer';
import {SmartVaultRepository} from '../../repository/smartVault';
import {SmartVaultEvent} from '../types';

@singleton()
@injectable()
export class SmartVaultAssetProjectionPrisma implements EventStreamProjection {
  constructor(
    @inject('SmartVaultAssetReducer')
    private readonly smartVaultAssetReducer: SmartVaultAssetReducer,

    @inject('SmartVaultRepository')
    private readonly smartVaultRepository: SmartVaultRepository
  ) {}

  async handleWriteProjection(
    prisma: Prisma.Prisma.TransactionClient,
    event: SmartVaultEvent,
    eventStream: EventStream<SmartVaultEvent>
  ): Promise<void> {
    const aggregate = this.smartVaultAssetReducer.reduce(eventStream);

    await this.smartVaultRepository.createSmartVaultAssetProjection(
      prisma,
      aggregate
    );
  }
}
