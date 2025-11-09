import {inject, injectable, singleton} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';
import * as Public from '~/domain/models/public';

import {calculateTransactionHash} from '~/domain/utils/transaction.util';

import {TwoWayOrderPendingRepositoryPrisma} from '~/implementation/prisma/repositories/twoWayOrderPending.repository';
import {TwoWayOrderPendingCancelRepositoryPrisma} from '~/implementation/prisma/repositories/twoWayOrderPendingCancel.repository';
import {TwoWayOrderRepositoryPrisma} from '~/implementation/prisma/repositories/twoWayOrder.repository';

import {TransactionSubmitOrPostProcessHandler} from './transactionSubmitOrPostProcessHandler';

@singleton()
@injectable()
export class TransactionPostSubmitHandlerTwoWayOrder
  implements
    TransactionSubmitOrPostProcessHandler<
      Public.SignedTransaction,
      Public.SignedTransaction
    >
{
  constructor(
    @inject('TwoWayOrderPendingRepository')
    private readonly pendingRepo: TwoWayOrderPendingRepositoryPrisma,
    @inject('TwoWayOrderPendingCancelRepository')
    private readonly pendingCancelRepo: TwoWayOrderPendingCancelRepositoryPrisma,
    @inject('TwoWayOrderRepository')
    private readonly twoRepo: TwoWayOrderRepositoryPrisma
  ) {}

  async handleTransaction(
    context: TransactionalContext,
    signedTransaction: Public.SignedTransaction
  ): Promise<Public.SignedTransaction> {
    const {transactionId} = signedTransaction;

    const transactionPayload = signedTransaction.transactionPayload;
    const computedTxHash = calculateTransactionHash(transactionPayload);

    const pending = await this.pendingRepo.getByTransactionId(
      context,
      transactionId
    );

    if (pending) {
      const txHash =
        typeof pending.transactionHash === 'string' && pending.transactionHash
          ? pending.transactionHash
          : computedTxHash;

      await this.twoRepo.createPendingOpen(context, {
        userId: pending.userId,
        fromAssetId: pending.fromAssetId ?? undefined,
        fromAssetAmount: pending.fromAssetAmount ?? undefined,
        toAssetId: pending.toAssetId ?? undefined,
        toAssetAmount: pending.toAssetAmount ?? undefined,
        straightPrice: pending.straightPrice ?? undefined,
        depositAmount: pending.depositAmount ?? undefined,
        makerLovelaceFlatFeeAmount:
          pending.makerLovelaceFlatFeeAmount ?? undefined,
        makerFromAssetFeeAmount: pending.makerFromAssetFeeAmount ?? undefined,
        makerFromAssetFeePercent:
          typeof pending.makerFromAssetFeePercent === 'number'
            ? pending.makerFromAssetFeePercent
            : undefined,
        effectiveFromDate: pending.effectiveFromDate ?? null,
        effectiveUntilDate: pending.effectiveUntilDate ?? null,
        transactionHash: txHash,
      });

      try {
        await this.pendingRepo.deleteByTransactionId(context, transactionId);
      } catch {
        // ignore cleanup failure
      }
    }

    const pendingCancel = await this.pendingCancelRepo.getByTransactionId(
      context,
      transactionId
    );

    if (pendingCancel) {
      await this.twoRepo.markCancelledByUser(context, {
        twoWayOrderId: pendingCancel.twoWayOrderId,
        txHash: computedTxHash,
      });

      try {
        await this.pendingCancelRepo.deleteByTransactionId(
          context,
          transactionId
        );
      } catch {
        // ignore cleanup failure
      }
    }

    return signedTransaction;
  }
}
