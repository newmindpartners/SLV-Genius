import {inject, injectable} from 'tsyringe';

import {TransactionalContext} from '~/domain/context';

import * as Oura from '~/domain/models/oura';

import {ConfigService, LoggerService} from '~/domain/services';
import {UserRepository} from '~/domain/repositories';
import {TwoWayOrderRepositoryPrisma} from '~/implementation/prisma/repositories/twoWayOrder.repository';

@injectable()
export class TwoWayOrderOuraEventHandler implements Oura.EventHandler {
  constructor(
    @inject('ConfigService') private readonly configService: ConfigService,
    @inject('LoggerService') private readonly logger: LoggerService,
    @inject('TwoWayOrderRepository')
    private readonly twoRepo: TwoWayOrderRepositoryPrisma,
    @inject('UserRepository') private readonly userRepository: UserRepository
  ) {}

  getEventHandlerMap(): Oura.HandlerFunctionMap<Oura.Event> {
    return {
      Transaction: [this.handleTransaction.bind(this)],
      BlockEnd: [],
      RollBack: [this.handleRollBack.bind(this)],
    };
  }

  private async handleTransaction(
    context: TransactionalContext,
    event: Oura.Event
  ): Promise<void> {
    if (!Oura.isTransactionEvent(event)) return;

    const {transaction: tx} = event;
    const txHash = tx?.hash || '<unknown>';

    // bootstrap matching via .env to make initial verification easy
    const bootstrapCreate =
      this.configService.getDexTwoWayBootstrapCreateTxHashes();
    const bootstrapFill =
      this.configService.getDexTwoWayBootstrapFillTxHashes();

    if (txHash && bootstrapCreate.includes(txHash)) {
      this.logger.info(
        `[TWO-INGEST][CREATE] slot=${event.context?.slot} tx=${txHash}`
      );
      await this.twoRepo.recordEvent(context, {
        txHash,
        blockHash: event.context?.block_hash as string | undefined,
        slot: Number(event.context?.slot || 0),
        eventType: 'CREATE',
        txIndex: 0,
        payloadJson: JSON.stringify(event),
      });
      await this.twoRepo.markPendingOrderOpened(context, {
        txHash,
        outputIndex: 0,
        slot: Number(event.context?.slot || 0),
        transaction: tx,
      });
      this.debugTx(txHash, tx);
      return;
    }

    if (txHash && bootstrapFill.includes(txHash)) {
      this.logger.info(
        `[TWO-INGEST][FILL] slot=${event.context?.slot} tx=${txHash}`
      );
      const firstInput =
        Array.isArray(tx?.inputs) && tx.inputs.length > 0
          ? tx.inputs[0]
          : undefined;
      const consumedTxHash = firstInput?.tx_id || txHash;
      const consumedIndex =
        typeof firstInput?.index === 'number' ? firstInput.index : 0;
      await this.twoRepo.recordEvent(context, {
        txHash,
        blockHash: event.context?.block_hash as string | undefined,
        slot: Number(event.context?.slot || 0),
        eventType: 'FILL',
        txIndex: consumedIndex,
        payloadJson: JSON.stringify(event),
      });
      // mark order filled by the actually consumed utxo (from inputs[0])
      await this.twoRepo.markFilledByConsumedUtxo(context, {
        inputTxHash: consumedTxHash,
        inputIndex: consumedIndex,
        slot: Number(event.context?.slot || 0),
      });
      this.debugTx(txHash, tx);
      return;
    }

    // Generic detection (no bootstrap):
    // CREATE: any Plutus output with inline datum — treat as potential TWO order UTxO
    const outputs = Array.isArray(tx?.outputs) ? tx.outputs : [];
    for (let i = 0; i < outputs.length; i++) {
      const out = outputs[i] as Oura.TransactionOutput;
      const hasInlineDatum = Boolean(out?.inline_datum);
      if (!hasInlineDatum) continue;

      // Additional ingest log with script address context
      try {
        this.logger.info(
          `[TWO-INGEST][CREATE] slot=${event.context?.slot} tx=${txHash} outIdx=${i} scriptAddress=${out?.address}`
        );
      } catch (e) {
        // ignore logging failure
      }

      // Record CREATE event per output index
      await this.twoRepo.recordEvent(context, {
        txHash,
        blockHash: event.context?.block_hash as string | undefined,
        slot: Number(event.context?.slot || 0),
        eventType: 'CREATE',
        txIndex: i,
        payloadJson: JSON.stringify(event),
      });
      // No auto-create or enrich here; order is created on submit path

      this.logger.info(
        `[TWO-INGEST][CREATE] slot=${event.context?.slot} tx=${txHash} outIdx=${i}`
      );

      await this.twoRepo.markPendingOrderOpened(context, {
        txHash,
        outputIndex: i,
        slot: Number(event.context?.slot || 0),
        transaction: tx,
      });
    }

    // FILL/CANCEL: any input consuming previously indexed UTxO
    const inputs = Array.isArray(tx?.inputs) ? tx.inputs : [];
    for (let j = 0; j < inputs.length; j++) {
      const inp = inputs[j];
      const consumedTxHash = inp?.tx_id;
      const consumedIndex = inp?.index;
      if (!consumedTxHash || typeof consumedIndex !== 'number') continue;

      // Try to infer deltas by matching contract change output with inline datum
      let fromFilled: bigint | null = null;
      let toFilled: bigint | null = null;
      try {
        const order = await this.twoRepo.findOrderByConsumedUtxo(context, {
          inputTxHash: consumedTxHash,
          inputIndex: consumedIndex,
        });
        if (order) {
          const outputsTx = Array.isArray(tx?.outputs) ? tx.outputs : [];
          // Heuristic: contract change = output with inline_datum present
          const change = outputsTx.find(o => Boolean(o?.inline_datum));
          const prevTo = BigInt(order.toAssetAmountTotalRemaining ?? 0);
          const prevFrom = BigInt(order.fromAssetAmountTotalRemaining ?? 0);
          if (change) {
            const ch = change as Oura.TransactionOutput;
            const changeTo = BigInt(ch.amount ?? 0);
            const changeFrom = BigInt(
              ch.assets?.find(
                a => `${a.policy}.${a.asset}` === order.fromAssetId
              )?.amount ?? 0
            );
            const toDelta = prevTo - changeTo;
            const fromDelta = prevFrom - changeFrom;
            fromFilled = fromDelta > BigInt(0) ? fromDelta : BigInt(0);
            toFilled = toDelta > BigInt(0) ? toDelta : BigInt(0);
            try {
              this.logger.debug(
                `[TWO-PARSE][FILL-DELTA] orderId=${
                  order.twoWayOrderId
                } tx=${txHash} inIdx=${j} prevTo=${prevTo.toString()} prevFrom=${prevFrom.toString()} changeTo=${changeTo.toString()} changeFrom=${changeFrom.toString()} toFilled=${toFilled.toString()} fromFilled=${fromFilled.toString()}`
              );
            } catch (e) {
              // ignore debug logging failure
            }
          } else {
            // final fill (no change output)
            fromFilled = prevFrom;
            toFilled = prevTo;
          }
        }
      } catch (e) {
        // fallback to repo default path, log at debug level
        try {
          this.logger.debug(
            `[TWO-PARSE][FILL-DELTA] failed to compute deltas: tx=${txHash} inIdx=${j} err=${
              (e as Error)?.message
            }`
          );
        } catch (e) {
          // ignore debug logging failure
        }
      }

      await this.twoRepo.recordEvent(context, {
        txHash,
        blockHash: event.context?.block_hash as string | undefined,
        slot: Number(event.context?.slot || 0),
        eventType: 'FILL',
        txIndex: consumedIndex,
        payloadJson: JSON.stringify(event),
      });
      let affected = 0;
      if (fromFilled !== null && toFilled !== null) {
        const order = await this.twoRepo.findOrderByConsumedUtxo(context, {
          inputTxHash: consumedTxHash,
          inputIndex: consumedIndex,
        });
        if (order) {
          // Compute user receives/pays and residual fees by outputs (non-contract outputs)
          const outputsTx = Array.isArray(tx?.outputs) ? tx.outputs : [];
          // Heuristic contract output already considered as 'change'; non-inline_datum outputs treated as external
          const externalOutputs = outputsTx.filter(o => !o?.inline_datum);
          const userReceiveTo = externalOutputs.reduce(
            (acc, o) => acc + BigInt(o.amount ?? 0),
            BigInt(0)
          );
          const userPayFrom = externalOutputs.reduce((acc, o) => {
            const amt =
              o.assets?.find(
                a => `${a.policy}.${a.asset}` === order.fromAssetId
              )?.amount ?? 0;
            return acc + BigInt(amt);
          }, BigInt(0));
          const feeTo = (toFilled ?? BigInt(0)) - userReceiveTo;
          const feeFrom = (fromFilled ?? BigInt(0)) - userPayFrom;
          await this.twoRepo.applyFillWithDeltas(context, {
            orderId: order.twoWayOrderId,
            fromFilled,
            toFilled,
            slot: Number(event.context?.slot || 0),
            txHash: txHash,
            txIndex: j,
            userReceiveTo,
            userPayFrom,
            feeTo: feeTo > BigInt(0) ? feeTo : BigInt(0),
            feeFrom: feeFrom > BigInt(0) ? feeFrom : BigInt(0),
          });
          affected = 1;
        }
      } else {
        affected = await this.twoRepo.markFilledByConsumedUtxo(context, {
          inputTxHash: consumedTxHash,
          inputIndex: consumedIndex,
          slot: Number(event.context?.slot || 0),
          txHash: txHash,
          txIndex: j,
        });
      }
      if (affected > 0) {
        this.logger.info(
          `[TWO-INGEST][FILL] slot=${event.context?.slot} tx=${txHash} inIdx=${consumedIndex} consumed=${consumedTxHash}#${consumedIndex}`
        );
      }
    }
  }

  private async handleRollBack(
    context: TransactionalContext,
    event: Oura.Event
  ): Promise<void> {
    if (!Oura.isRollBackEvent(event)) return;
    const slot = Number(event.roll_back?.block_slot ?? 0);
    const {deletedFills, deletedEvents, deletedOrdersOpenAfter, rebuiltOrders} =
      await this.twoRepo.rollbackToSlot(context, slot);
    this.logger.info(
      `[TWO-ROLLBACK] rollbackToSlot=${slot} affectedFills=${deletedFills} affectedEvents=${deletedEvents} affectedCreates=${deletedOrdersOpenAfter} rebuilt=${rebuiltOrders}`
    );
  }

  // Emit compact debug for quick triage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private debugTx(txHash: string, tx: any) {
    try {
      const inputs = Array.isArray(tx?.inputs) ? tx.inputs.length : 0;
      const outputs = Array.isArray(tx?.outputs) ? tx.outputs.length : 0;
      const mints = Array.isArray(tx?.mint) ? tx.mint.length : 0;
      const plutusData = Array.isArray(tx?.plutus_data)
        ? tx.plutus_data.length
        : 0;
      const redeemers = Array.isArray(tx?.plutus_redeemers)
        ? tx.plutus_redeemers.length
        : 0;
      this.logger.info(
        `[TWO-INGEST][TX] tx=${txHash} inputs=${inputs} outputs=${outputs} mints=${mints} plutus_data=${plutusData} redeemers=${redeemers}`
      );
    } catch {
      // ignore debug failure
    }
  }
}
