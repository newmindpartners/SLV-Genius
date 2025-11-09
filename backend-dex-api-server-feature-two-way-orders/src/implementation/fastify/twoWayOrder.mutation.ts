import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';

import {ConfigService, CoreService} from '~/domain/services';
import {PrismaClient} from '@prisma/client';
import {TwoWayOrderPendingRepositoryPrisma} from '~/implementation/prisma/repositories/twoWayOrderPending.repository';
import {TwoWayOrderPendingCancelRepositoryPrisma} from '~/implementation/prisma/repositories/twoWayOrderPendingCancel.repository';
import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';

import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';

@singleton()
export class TwoWayOrderMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService') configService: ConfigService,
    @inject('CoreService') private readonly coreService: CoreService,
    @inject('PrismaClient') private readonly prisma: PrismaClient,
    @inject('TwoWayOrderPendingRepository')
    private readonly pendingRepo: TwoWayOrderPendingRepositoryPrisma,
    @inject('TwoWayOrderPendingCancelRepository')
    private readonly pendingCancelRepo: TwoWayOrderPendingCancelRepositoryPrisma
  ) {
    super(configService);
  }

  async place(
    req: FastifyRequest<{
      Body: Core.TwoWayOrderPlaceRequest;
    }>
  ): Promise<Public.UnsignedTransaction> {
    const {body} = req;
    const response = await this.coreService.twoWayOrderPlace(body);
    const {
      transactionPayload,
      transactionId,
      transactionHash,
      depositAmount,
      makerLovelaceFlatFeeAmount,
      makerFromAssetFeeAmount,
      makerFromAssetFeePercent,
    } = response;
    // Persist pending submit for post-submit projection
    try {
      const anyReq = req as unknown as Record<string, unknown>;
      const user = (anyReq?.user as {userId?: string}) || {};
      const userId = user.userId;
      if (userId) {
        const fromAssetId = `${body.fromAssetPolicyId}.${body.fromAssetName}`;
        const toAssetId = `${body.toAssetPolicyId}.${body.toAssetName}`;
        await this.prisma.$transaction(async prisma => {
          await this.pendingRepo.save(prisma, {
            transactionId,
            userId,
            transactionHash: transactionHash ?? null,
            fromAssetId,
            fromAssetAmount: BigInt(body.fromAssetAmount),
            toAssetId,
            toAssetAmount: BigInt(
              // if straight price provided, toAssetAmount may be 0 at core request; store as-is
              typeof body.toAssetAmount === 'string' ? body.toAssetAmount : '0'
            ),
            straightPrice: body.straightPrice,
            depositAmount:
              depositAmount !== undefined ? BigInt(depositAmount) : undefined,
            makerLovelaceFlatFeeAmount:
              makerLovelaceFlatFeeAmount !== undefined
                ? BigInt(makerLovelaceFlatFeeAmount)
                : undefined,
            makerFromAssetFeeAmount:
              makerFromAssetFeeAmount !== undefined
                ? BigInt(makerFromAssetFeeAmount)
                : undefined,
            makerFromAssetFeePercent:
              makerFromAssetFeePercent !== undefined
                ? Number(makerFromAssetFeePercent)
                : undefined,
            effectiveFromDate: body.effectiveFromDate
              ? new Date(body.effectiveFromDate)
              : null,
            effectiveUntilDate: body.effectiveUntilDate
              ? new Date(body.effectiveUntilDate)
              : null,
          });
        });
      }
    } catch {
      // best-effort; post-submit may still succeed without pending record
    }
    return {transactionPayload, transactionId};
  }

  async fill({
    body,
  }: FastifyRequest<{
    Body: Core.TwoWayOrderFillRequest;
  }>): Promise<Public.UnsignedTransaction> {
    const response = await this.coreService.twoWayOrderFill(body);
    const {transactionPayload, transactionId} = response;
    return {transactionPayload, transactionId};
  }

  async cancel(
    req: FastifyRequest<{
      Body: Core.TwoWayOrderCancelRequest;
    }>
  ): Promise<Public.UnsignedTransaction> {
    const {body} = req;
    const response = await this.coreService.twoWayOrderCancel(body);
    const {transactionPayload, transactionId} = response;

    const utxoReference = body.utxoReference;
    const [txHash, indexStr] = utxoReference.split('#');
    if (!txHash || indexStr === undefined) {
      throw new ApplicationError(
        ErrorCode.ORDER__ORDER_NOT_FOUND,
        'Invalid utxo reference'
      );
    }
    const utxoIndex = Number(indexStr);
    if (Number.isNaN(utxoIndex)) {
      throw new ApplicationError(
        ErrorCode.ORDER__ORDER_NOT_FOUND,
        'Invalid utxo index'
      );
    }

    const order = await this.prisma.twoWayOrder.findFirst({
      where: {
        utxoReferenceTransactionHash: txHash,
        utxoReferenceIndex: utxoIndex,
      },
    });

    if (!order) {
      throw new ApplicationError(ErrorCode.ORDER__ORDER_NOT_FOUND);
    }

    const anyReq = req as unknown as Record<string, unknown>;
    const user = (anyReq?.user as {userId?: string}) || {};
    const userId = user.userId;
    if (!userId) {
      throw new ApplicationError(ErrorCode.ORDER__USER_NOT_ATTACHED_TO_REQUEST);
    }

    try {
      await this.prisma.$transaction(async prisma => {
        await this.pendingCancelRepo.save(prisma, {
          transactionId,
          userId,
          twoWayOrderId: order.twoWayOrderId,
        });
      });
    } catch {
      // best effort
    }

    return {transactionPayload, transactionId};
  }
}
