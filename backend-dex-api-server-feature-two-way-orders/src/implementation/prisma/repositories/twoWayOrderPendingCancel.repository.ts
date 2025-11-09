import {injectable, singleton} from 'tsyringe';

import {Prisma} from '@prisma/client';

@singleton()
@injectable()
export class TwoWayOrderPendingCancelRepositoryPrisma {
  async save(
    prisma: Prisma.TransactionClient,
    params: {transactionId: string; userId: string; twoWayOrderId: string}
  ): Promise<void> {
    const {transactionId, userId, twoWayOrderId} = params;
    const client = prisma as unknown as {
      twoWayOrderPendingCancel: {
        upsert: Function;
      };
    };
    await client.twoWayOrderPendingCancel.upsert({
      where: {transactionId},
      create: {transactionId, userId, twoWayOrderId},
      update: {userId, twoWayOrderId},
    });
  }

  async getByTransactionId(
    prisma: Prisma.TransactionClient,
    transactionId: string
  ) {
    const client = prisma as unknown as {
      twoWayOrderPendingCancel: {
        findUnique: Function;
      };
    };
    return client.twoWayOrderPendingCancel.findUnique({
      where: {transactionId},
    });
  }

  async deleteByTransactionId(
    prisma: Prisma.TransactionClient,
    transactionId: string
  ): Promise<void> {
    const client = prisma as unknown as {
      twoWayOrderPendingCancel: {
        delete: Function;
      };
    };
    await client.twoWayOrderPendingCancel.delete({where: {transactionId}});
  }
}
