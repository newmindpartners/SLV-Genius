import { FastifyReply, FastifyRequest } from 'fastify';

import { map } from 'lodash';

import { inject, singleton } from 'tsyringe';

import { PrismaClient } from '@prisma/client';
import * as Oura from '~/domain/models/oura';
import * as Public from '~/domain/models/public';
import { SignedTransaction } from '~/domain/models/public';

import { ConfigService } from '~/domain/services';

import { TransactionApplication } from '~/application/transaction.application';

import { AbstractMutation } from '~/implementation/fastify/abstract.mutation';

import {
  jobName,
  jobOptions,
  queueName,
} from '~/queueProcessors/transactionSubmit/consts';
import { TransactionSubmitStatus } from './plugin/queue';

import { isProjectionError } from '~/implementation/prisma/projections/projection.error';
import { isBigIntOverflow } from '~/implementation/utils/prisma';
import { isError } from '~/implementation/utils/typescript';

@singleton()
export class TransactionMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject(TransactionApplication)
    private readonly transactionApplication: TransactionApplication
  ) {
    super(configService);
  }

  async submitTransactionOrEnqueue(
    req: FastifyRequest<{Body: SignedTransaction}>,
    reply: FastifyReply
  ): Promise<
    | Public.GeneralError
    | Public.TransactionSubmitSuccessResponse
    | Public.TransactionSubmitAcceptedResponse
  > {
    if (this.configService.isTransactionSubmitQueueFeatureEnabled()) {
      return await this.submitTransactionEnqueue(req, reply);
    } else {
      return await this.submitTransaction(req, reply);
    }
  }

  private async submitTransactionEnqueue(
    req: FastifyRequest<{Body: SignedTransaction}>,
    reply: FastifyReply
  ): Promise<Public.TransactionSubmitAcceptedResponse> {
    await req.queues[queueName].add(jobName, req.body, jobOptions);

    const result = {
      status: TransactionSubmitStatus.QUEUED,
    };

    return reply.code(202).send(result);
  }

  private async submitTransaction(
    req: FastifyRequest<{Body: SignedTransaction}>,
    reply: FastifyReply
  ): Promise<Public.GeneralError | Public.TransactionSubmitSuccessResponse> {
    const submittedTransactionResponse = await this.prisma.$transaction(
      async prisma =>
        await this.transactionApplication.submitTransaction(prisma, req.body),
      this.configService.getPrismaTransactionOptions()
    );

    if (!(submittedTransactionResponse instanceof Error)) {
      const result = {
        status: TransactionSubmitStatus.SUBMITTED,
        transaction: submittedTransactionResponse,
      };

      return reply.code(200).send(result);
    }

    const error = submittedTransactionResponse as Error & {
      errorCode?: string;
    };
    const generalError: Public.GeneralError = {
      errorCode: error.errorCode ?? 'UNKNOWN_ERROR',
      message: error.message,
    };
    return reply.code(400).send(generalError);
  }

  async handleOuraEvent(req: FastifyRequest<{Body: Oura.Event}>) {
    const event: Oura.Event = req.body;
    const eventVariant: Oura.EventVariant = event.variant;

    // Verbose Oura logging for debugging TWO parsing
    // Safe to keep: logs are structured and not performance critical under normal flow
    try {
      const createTxBoot = this.configService.getDexTwoWayBootstrapCreateTxHashes();
      const fillTxBoot = this.configService.getDexTwoWayBootstrapFillTxHashes();
      if (Oura.isTransactionEvent(event)) {
        const tx = event.transaction;
        // top-level tx info
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req.log as any).info({ tx_hash: tx?.hash, inputs: tx?.inputs?.length, outputs: tx?.outputs?.length, mints: tx?.mint?.length }, '[TWO-DEBUG][OURA] Oura <Transaction>');

        // summarize minted assets (policyId.assetName) to distinguish TWO vs OWO by policy
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mints: any[] = Array.isArray(tx?.mint) ? (tx?.mint as any[]) : [];
        const mintedAssets = mints
          .map(m => {
            // common oura mint fields across versions
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const policy = (m as any)?.policy || (m as any)?.policy_id || (m as any)?.policyId;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const asset = (m as any)?.asset || (m as any)?.asset_name || (m as any)?.assetName;
            return policy && asset ? `${policy}.${asset}` : undefined;
          })
          .filter((x): x is string => Boolean(x));
        const uniquePolicies = Array.from(new Set(mintedAssets.map(a => a.split('.')[0])));
        if (mintedAssets.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (req.log as any).info({ tx_hash: tx?.hash, policies: uniquePolicies, assets: mintedAssets.slice(0, 10), assets_total: mintedAssets.length }, '[TWO-DEBUG][OURA] Oura <TransactionMint>');
        }

        // summarize datum/redeemers presence (useful for contract tx classification)
        const plutusDataCount = Array.isArray(tx?.plutus_data) ? tx?.plutus_data.length : 0;
        const redeemersCount = Array.isArray(tx?.plutus_redeemers) ? tx?.plutus_redeemers.length : 0;
        if (plutusDataCount > 0 || redeemersCount > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (req.log as any).info({ tx_hash: tx?.hash, plutus_data: plutusDataCount, plutus_redeemers: redeemersCount }, '[TWO-DEBUG][OURA] Oura <TransactionPlutus>');
        }
        // explicit bootstrap markers for known TWO tx hashes (makes grepping trivial)
        if (tx?.hash && createTxBoot.includes(tx.hash)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (req.log as any).info({ tx_hash: tx?.hash }, '[TWO-BOOTSTRAP] Matched TWO creation tx');
        }
        if (tx?.hash && fillTxBoot.includes(tx.hash)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (req.log as any).info({ tx_hash: tx?.hash }, '[TWO-BOOTSTRAP] Matched TWO fill tx');
        }

        // dump outputs (address, index, value, inline datum presence)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req.log as any).debug({ outputs: tx?.outputs }, '[TWO-DEBUG][OURA] Oura tx.outputs');
        // dump mints (policyId, asset)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req.log as any).debug({ mint: tx?.mint }, '[TWO-DEBUG][OURA] Oura tx.mint');
        // dump plutus data/redeemers (datum bodies)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req.log as any).debug({ plutus_data: tx?.plutus_data, plutus_redeemers: tx?.plutus_redeemers }, '[TWO-DEBUG][OURA] Oura tx.plutus');
      } else if (Oura.isBlockEvent(event)) {
        const {block_end} = event;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req.log as any).info({ block_hash: block_end?.hash, slot: block_end?.slot, number: block_end?.number }, '[TWO-DEBUG][OURA] Oura <BlockEnd>');
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req.log as any).warn({ error: (e as Error)?.message }, '[TWO-DEBUG][OURA] Oura logging failed');
    }

    const eventHandlers =
      this.transactionApplication.getEventHandlers(eventVariant);

    // Each event handler is provided its own db transaction.
    const preppedHandlers = map(
      eventHandlers,
      handler => async (event: Oura.Event) => {
        try {
          await this.prisma.$transaction(
            async prisma => handler(prisma, event),
            this.configService.getPrismaTransactionOptions()
          );
          // it catch error after transaction is rolled back to ensure database integrity
        } catch (error) {
          if (
            isError(error) &&
            isProjectionError(error) &&
            isBigIntOverflow(error.originalError)
          )
            /**
             * this is a special case, error is handled gracefully with
             * desired effect to not project things in the database,
             * and return 200 OK to not break upcoming events
             **/ return;
          else throw error;
        }
      }
    );

    // Perform handlers sequentially to avoid race conditions (prisma upsert)
    for (const handler of preppedHandlers) {
      await handler(event);
    }
  }
}
