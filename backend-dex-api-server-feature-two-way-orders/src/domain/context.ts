import {PrismaClient as TransactionalClient} from '@prisma/client';

export type TransactionalContext = Omit<
  TransactionalClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
