import * as Prisma from '@prisma/client';

export type SmartVaultOperationAggregate = {
  smartVaultId: string;
  smartVaultOperations: Omit<
    Prisma.Prisma.SmartVaultOperationCreateManyInput,
    'smartVaultId' | 'created' | 'updated'
  >[];
};
