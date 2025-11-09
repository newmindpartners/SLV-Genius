import * as Prisma from '@prisma/client';

export type SmartVaultAggregate = Omit<
  Prisma.Prisma.SmartVaultGetPayload<{}>,
  'created' | 'updated'
>;
