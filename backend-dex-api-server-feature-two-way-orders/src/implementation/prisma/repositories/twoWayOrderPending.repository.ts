import {injectable, singleton} from 'tsyringe';

import {Prisma} from '@prisma/client';

@singleton()
@injectable()
export class TwoWayOrderPendingRepositoryPrisma {
  async save(
    prisma: Prisma.TransactionClient,
    params: {
      transactionId: string;
      userId: string;
      transactionHash?: string;
      fromAssetId?: string;
      fromAssetAmount?: bigint;
      toAssetId?: string;
      toAssetAmount?: bigint;
      straightPrice?: string;
      depositAmount?: bigint;
      makerLovelaceFlatFeeAmount?: bigint;
      makerFromAssetFeePercent?: number;
      makerFromAssetFeeAmount?: bigint;
      effectiveFromDate?: Date | null;
      effectiveUntilDate?: Date | null;
    }
  ): Promise<void> {
    const {
      transactionId,
      userId,
      transactionHash,
      fromAssetId,
      fromAssetAmount,
      toAssetId,
      toAssetAmount,
      straightPrice,
      depositAmount,
      makerLovelaceFlatFeeAmount,
      makerFromAssetFeePercent,
      makerFromAssetFeeAmount,
      effectiveFromDate,
      effectiveUntilDate,
    } = params;
    const client = prisma as unknown as {
      twoWayOrderPendingSubmit: {
        upsert: Function;
      };
    };
    await client.twoWayOrderPendingSubmit.upsert({
      where: {transactionId},
      create: {
        transactionId,
        userId,
        transactionHash: transactionHash ?? null,
        fromAssetId: fromAssetId ?? null,
        fromAssetAmount:
          typeof fromAssetAmount === 'bigint' ? fromAssetAmount : null,
        toAssetId: toAssetId ?? null,
        toAssetAmount: typeof toAssetAmount === 'bigint' ? toAssetAmount : null,
        straightPrice: straightPrice ?? null,
        depositAmount:
          typeof depositAmount === 'bigint' ? depositAmount : null,
        makerLovelaceFlatFeeAmount:
          typeof makerLovelaceFlatFeeAmount === 'bigint'
            ? makerLovelaceFlatFeeAmount
            : null,
        makerFromAssetFeePercent:
          typeof makerFromAssetFeePercent === 'number'
            ? makerFromAssetFeePercent
            : null,
        makerFromAssetFeeAmount:
          typeof makerFromAssetFeeAmount === 'bigint'
            ? makerFromAssetFeeAmount
            : null,
        effectiveFromDate: effectiveFromDate ?? null,
        effectiveUntilDate: effectiveUntilDate ?? null,
      },
      update: {
        userId,
        transactionHash: transactionHash ?? null,
        fromAssetId: fromAssetId ?? null,
        fromAssetAmount:
          typeof fromAssetAmount === 'bigint' ? fromAssetAmount : null,
        toAssetId: toAssetId ?? null,
        toAssetAmount: typeof toAssetAmount === 'bigint' ? toAssetAmount : null,
        straightPrice: straightPrice ?? null,
        depositAmount:
          typeof depositAmount === 'bigint' ? depositAmount : null,
        makerLovelaceFlatFeeAmount:
          typeof makerLovelaceFlatFeeAmount === 'bigint'
            ? makerLovelaceFlatFeeAmount
            : null,
        makerFromAssetFeePercent:
          typeof makerFromAssetFeePercent === 'number'
            ? makerFromAssetFeePercent
            : null,
        makerFromAssetFeeAmount:
          typeof makerFromAssetFeeAmount === 'bigint'
            ? makerFromAssetFeeAmount
            : null,
        effectiveFromDate: effectiveFromDate ?? null,
        effectiveUntilDate: effectiveUntilDate ?? null,
      },
    });
  }

  async getByTransactionId(
    prisma: Prisma.TransactionClient,
    transactionId: string
  ) {
    const client = prisma as unknown as {
      twoWayOrderPendingSubmit: {
        findUnique: Function;
      };
    };
    return client.twoWayOrderPendingSubmit.findUnique({
      where: {transactionId},
    });
  }

  async deleteByTransactionId(
    prisma: Prisma.TransactionClient,
    transactionId: string
  ): Promise<void> {
    const client = prisma as unknown as {
      twoWayOrderPendingSubmit: {
        delete: Function;
      };
    };
    await client.twoWayOrderPendingSubmit.delete({where: {transactionId}});
  }
}
