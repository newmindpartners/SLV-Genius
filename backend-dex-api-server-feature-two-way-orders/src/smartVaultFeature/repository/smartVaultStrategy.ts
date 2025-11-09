import {injectable, singleton} from 'tsyringe';

import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';

@singleton()
@injectable()
export class SmartVaultStrategyRepository {
  constructor() {}

  async listSmartVaultStrategies(
    prisma: Prisma.Prisma.TransactionClient
  ): Promise<Private.SmartVaultStrategy[]> {
    return prisma.smartVaultStrategy.findMany({
      orderBy: {
        created: 'asc',
      },
    });
  }

  async getSmartVaultStrategyById(
    prisma: Prisma.Prisma.TransactionClient,
    smartVaultStrategyId: string
  ): Promise<Private.SmartVaultStrategy | null> {
    return prisma.smartVaultStrategy.findFirst({
      where: {
        smartVaultStrategyId,
      },
    });
  }
}
