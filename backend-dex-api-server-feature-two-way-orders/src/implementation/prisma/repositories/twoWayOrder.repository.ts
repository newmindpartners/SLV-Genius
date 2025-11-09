import {inject, injectable, singleton} from 'tsyringe';

import {Prisma} from '@prisma/client';
import * as Oura from '~/domain/models/oura';
import {LoggerService} from '~/domain/services';
import {bigIntStringifyReplacer} from '~/domain/services/logger.service';

@singleton()
@injectable()
export class TwoWayOrderRepositoryPrisma {
  constructor(
    @inject('LoggerService') private readonly logger: LoggerService
  ) {}

  async createPendingOpen(
    prisma: Prisma.TransactionClient,
    params: {
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
    const now = new Date();
    const fromAmount =
      typeof params.fromAssetAmount === 'bigint'
        ? params.fromAssetAmount
        : BigInt(0);
    const toAmount =
      typeof params.toAssetAmount === 'bigint'
        ? params.toAssetAmount
        : BigInt(0);
    const computedPrice =
      typeof params.straightPrice === 'string' && params.straightPrice.length
        ? Number(params.straightPrice)
        : fromAmount > BigInt(0)
        ? Number(toAmount) / Number(fromAmount)
        : null;
    const data: Prisma.TwoWayOrderCreateInput = {
      // link user when possible
      user: {connect: {userId: params.userId}},
      fromAssetId: params.fromAssetId ?? '',
      toAssetId: params.toAssetId ?? '',
      fromAssetAmount: fromAmount,
      toAssetAmount: toAmount,
      toAssetAmountTotalRemaining: toAmount,
      fromAssetAmountTotalRemaining: fromAmount,
      toAssetAmountTotalFilled: BigInt(0),
      fromAssetAmountTotalFilled: BigInt(0),
      price: computedPrice,
      effectiveFromDate: params.effectiveFromDate ?? null,
      effectiveUntilDate: params.effectiveUntilDate ?? null,
      priceNumerator: null,
      priceDenominator: null,
      depositAmount:
        typeof params.depositAmount === 'bigint'
          ? params.depositAmount
          : null,
      makerLovelaceFlatFeeAmount:
        typeof params.makerLovelaceFlatFeeAmount === 'bigint'
          ? params.makerLovelaceFlatFeeAmount
          : null,
      makerFromAssetFeePercent:
        typeof params.makerFromAssetFeePercent === 'number'
          ? params.makerFromAssetFeePercent
          : null,
      makerFromAssetFeeAmount:
        typeof params.makerFromAssetFeeAmount === 'bigint'
          ? params.makerFromAssetFeeAmount
          : null,
      takerLovelaceFlatFeeAmount: null,
      takerFromAssetFeePercent: null,
      takerFromAssetFeeAmount: null,
      utxoReferenceTransactionHash: params.transactionHash ?? null,
      utxoReferenceIndex: null,
      orderStatus: 'PENDING',
      orderDate: now,
      transactionDateOpen: null,
      transactionDateFill: null,
      transactionDateCancel: null,
      openSlot: 0,
      toAssetNetReceived: BigInt(0),
      pnlToAbs: BigInt(0),
      pnlToPct: 0,
    } as unknown as Prisma.TwoWayOrderCreateInput;

    try {
      await prisma.twoWayOrder.create({data});
    } catch {
      // If user relation or constraints are not yet ready, skip; Oura will reconcile later
    }
  }

  async recordEvent(
    prisma: Prisma.TransactionClient,
    params: {
      txHash: string;
      blockHash?: string;
      slot: number;
      eventType: 'CREATE' | 'FILL' | 'CANCEL';
      txIndex?: number;
      payloadJson: string;
    }
  ) {
    const {txHash, blockHash, slot, eventType, txIndex, payloadJson} = params;
    const normalizedIndex = typeof txIndex === 'number' ? txIndex : 0;
    await prisma.twoWayOrderEvent.upsert({
      where: {
        txHash_eventType_txIndex: {txHash, eventType, txIndex: normalizedIndex},
      },
      create: {
        txHash,
        blockHash: blockHash || null,
        slot,
        eventType,
        txIndex: normalizedIndex,
        payloadJson,
      },
      update: {blockHash: blockHash || null, slot, payloadJson},
    });
  }

  async createOpenFromTx(
    prisma: Prisma.TransactionClient,
    params: {
      txHash: string;
      outputIndex: number;
      slot?: number;
      blockHash?: string;
    }
  ): Promise<{updated: boolean; isUserOrder: boolean}> {
    const now = new Date();
    const openSlot = typeof params.slot === 'number' ? params.slot : 0;
    const existing = await prisma.twoWayOrder.findUnique({
      where: {
        utxoReferenceTransactionHash_utxoReferenceIndex: {
          utxoReferenceTransactionHash: params.txHash,
          utxoReferenceIndex: params.outputIndex,
        },
      },
    });

    if (!existing) {
      try {
        this.logger.debug(
          `[TWO-REPO][UPSERT-OPEN][SKIP] no pending order for tx=${params.txHash} outIdx=${params.outputIndex}`
        );
      } catch {
        // ignore logging failure
      }
      return {updated: false, isUserOrder: false};
    }

    const isUserOrder = existing.userId !== null;

    const order = await prisma.twoWayOrder.update({
      where: {twoWayOrderId: existing.twoWayOrderId},
      data: {
        orderStatus: 'OPEN',
        utxoReferenceIndex: params.outputIndex,
        transactionDateOpen: existing.transactionDateOpen ?? now,
        updated: now,
        openSlot,
      },
    });
    try {
      this.logger.info(
        `[TWO-REPO][OPEN] tx=${params.txHash} outIdx=${params.outputIndex} openSlot=${openSlot} orderId=${order.twoWayOrderId}`
      );
      await prisma.twoWayOrderActivity.create({
        data: {
          twoWayOrderId: order.twoWayOrderId,
          activityType: 'OPEN',
          txHash: params.txHash,
          slot: openSlot,
          message: 'Order observed on-chain (OPEN)',
        },
      });
    } catch (e) {
      // ignore logging/activity failure
    }
    return {updated: true, isUserOrder};
  }

  async markPendingOrderOpened(
    prisma: Prisma.TransactionClient,
    params: {
      txHash: string;
      outputIndex: number;
      slot?: number;
      transaction?: Oura.Transaction;
    }
  ): Promise<boolean> {
    const order = await prisma.twoWayOrder.findFirst({
      where: {
        utxoReferenceTransactionHash: params.txHash,
        orderStatus: 'PENDING',
      },
      orderBy: {created: 'asc'},
    });

    if (!order) return false;

    const now = new Date();
    const mintAssetId =
      this.getMintAssetIdFromTransaction(params.transaction) ??
      order.mintAssetId;

    await prisma.twoWayOrder.update({
      where: {twoWayOrderId: order.twoWayOrderId},
      data: {
        orderStatus: 'OPEN',
        utxoReferenceIndex: params.outputIndex,
        mintAssetId,
        transactionDateOpen: now,
        openSlot:
          typeof params.slot === 'number' ? params.slot : order.openSlot ?? 0,
        updated: now,
      },
    });

    try {
      await prisma.twoWayOrderActivity.create({
        data: {
          twoWayOrderId: order.twoWayOrderId,
          activityType: 'OPEN',
          txHash: params.txHash,
          slot: typeof params.slot === 'number' ? params.slot : 0,
          message: 'Order observed on-chain (OPEN)',
        },
      });
    } catch (e) {
      // ignore logging/activity failure
    }

    try {
      this.logger.info(
        `[TWO-REPO][OPEN-PENDING] tx=${params.txHash} outIdx=${params.outputIndex} orderId=${order.twoWayOrderId} mintAssetId=${mintAssetId}`
      );
    } catch (e) {
      // ignore logging failure
    }

    return true;
  }

  async markCancelledByUser(
    prisma: Prisma.TransactionClient,
    params: {twoWayOrderId: string; txHash?: string}
  ): Promise<void> {
    const now = new Date();
    const order = await prisma.twoWayOrder.update({
      where: {twoWayOrderId: params.twoWayOrderId},
      data: {
        orderStatus: 'CANCELLED',
        transactionDateCancel: now,
        updated: now,
      },
    });

    try {
      await prisma.twoWayOrderActivity.create({
        data: {
          twoWayOrderId: order.twoWayOrderId,
          activityType: 'CANCEL',
          txHash: params.txHash ?? null,
          message: 'Order cancellation submitted',
        },
      });
    } catch (e) {
      // ignore logging/activity failure
    }
  }

  async markFilledByConsumedUtxo(
    prisma: Prisma.TransactionClient,
    params: {
      inputTxHash: string;
      inputIndex: number;
      slot?: number;
      txHash?: string;
      txIndex?: number;
    }
  ): Promise<number> {
    const now = new Date();
    const result = await prisma.twoWayOrder.updateMany({
      where: {
        utxoReferenceTransactionHash: params.inputTxHash,
        utxoReferenceIndex: params.inputIndex,
        orderStatus: 'OPEN',
      },
      data: {
        orderStatus: 'FILLED',
        transactionDateFill: now,
        partialFillCount: {increment: 1},
        updated: now,
      },
    });

    if (result.count > 0) {
      const order = await prisma.twoWayOrder.findFirst({
        where: {
          utxoReferenceTransactionHash: params.inputTxHash,
          utxoReferenceIndex: params.inputIndex,
        },
      });
      if (order) {
        // Fallback amounts: when actual amounts are not yet derivable, use deltas of totals if available; otherwise 0
        const toFilledFallback = BigInt(0);
        const fromFilledFallback = BigInt(0);

        const fill = await prisma.twoWayOrderFill.upsert({
          where: {
            twoWayOrderId_txHash_txIndex: {
              twoWayOrderId: order.twoWayOrderId,
              txHash: params.txHash ?? params.inputTxHash,
              txIndex: params.txIndex ?? params.inputIndex,
            },
          },
          create: {
            twoWayOrderId: order.twoWayOrderId,
            toAssetId: order.toAssetId,
            fromAssetId: order.fromAssetId,
            toAssetAmountFilled: toFilledFallback,
            fromAssetAmountFilled: fromFilledFallback,
            price: order.price ?? 0,
            priceNumerator: order.priceNumerator ?? null,
            priceDenominator: order.priceDenominator ?? null,
            txHash: params.txHash ?? params.inputTxHash,
            txIndex: params.txIndex ?? params.inputIndex,
            slot: typeof params.slot === 'number' ? params.slot : 0,
          },
          update: {
            updated: now,
            slot: typeof params.slot === 'number' ? params.slot : 0,
          },
        });

        // Update order totals conservatively when amounts are unknown: keep totals as-is (no decrement) to avoid wrong PnL
        // When real amounts will be available, this logic should decrement remaining and increment filled.
        // Here we only ensure status/partialFillCount/last-fill timestamps are tracked.
        try {
          this.logger.info(
            `[TWO-REPO][FILL] inputUtxo=${params.inputTxHash}#${
              params.inputIndex
            } orderId=${
              order.twoWayOrderId
            } fromFilled=${fill.fromAssetAmountFilled.toString()} toFilled=${fill.toAssetAmountFilled.toString()} partialFillCount=${
              order.partialFillCount + 1
            } fill=${JSON.stringify(
              fill,
              bigIntStringifyReplacer
            )} order=${JSON.stringify(
              order,
              bigIntStringifyReplacer
            )} params=${JSON.stringify(params, bigIntStringifyReplacer)}`
          );
          await prisma.twoWayOrderActivity.create({
            data: {
              twoWayOrderId: order.twoWayOrderId,
              activityType: 'FILL',
              txHash: params.txHash ?? params.inputTxHash,
              slot: typeof params.slot === 'number' ? params.slot : 0,
              message: `Order filled (partialFillCount=${
                order.partialFillCount + 1
              })`,
            },
          });
        } catch (e) {
          this.logger.info(
            `[TWO-REPO][FILL][ERROR] Failed to log fill or create activity: inputUtxo=${
              params.inputTxHash
            }#${params.inputIndex} orderId=${order.twoWayOrderId} error=${
              (e as Error)?.message || e
            }`
          );
          // ignore logging/activity failure
        }
      }
    }

    return result.count;
  }

  async findOrderByConsumedUtxo(
    prisma: Prisma.TransactionClient,
    params: {inputTxHash: string; inputIndex: number}
  ) {
    return prisma.twoWayOrder.findFirst({
      where: {
        utxoReferenceTransactionHash: params.inputTxHash,
        utxoReferenceIndex: params.inputIndex,
      },
    });
  }

  async applyFillWithDeltas(
    prisma: Prisma.TransactionClient,
    params: {
      orderId: string;
      fromFilled: bigint;
      toFilled: bigint;
      slot?: number;
      txHash: string;
      txIndex: number;
      userReceiveTo?: bigint;
      userPayFrom?: bigint;
      feeTo?: bigint;
      feeFrom?: bigint;
    }
  ) {
    const now = new Date();

    // Update order totals (clamped to non-negative)
    const order = await prisma.twoWayOrder.findUnique({
      where: {twoWayOrderId: params.orderId},
    });
    if (!order) return;

    const newToRemaining =
      (order.toAssetAmountTotalRemaining ?? BigInt(0)) - params.toFilled;
    const newFromRemaining =
      (order.fromAssetAmountTotalRemaining ?? BigInt(0)) - params.fromFilled;
    const hasDelta =
      params.toFilled > BigInt(0) || params.fromFilled > BigInt(0);

    // Compute PnL/net received in toAsset (now that prisma types are updated)
    const prevNetReceived = BigInt(order.toAssetNetReceived ?? 0);
    // Correct net delta: min(toFilled, userReceiveTo) if present; else (toFilled - feeTo)
    let netToReceivedDelta = BigInt(0);
    if (typeof params.userReceiveTo === 'bigint') {
      netToReceivedDelta =
        params.userReceiveTo <= params.toFilled
          ? params.userReceiveTo
          : params.toFilled;
    } else {
      const feeTo = typeof params.feeTo === 'bigint' ? params.feeTo : BigInt(0);
      const tentative = params.toFilled - feeTo;
      netToReceivedDelta = tentative > BigInt(0) ? tentative : BigInt(0);
    }
    const newNetReceived = prevNetReceived + netToReceivedDelta;
    const initialTo = BigInt(order.toAssetAmount ?? 0);
    const pnlAbs = newNetReceived - initialTo;
    const pnlPct =
      Number(initialTo > 0n ? (pnlAbs * 10000n) / initialTo : 0n) / 100;

    await prisma.twoWayOrder.update({
      where: {twoWayOrderId: params.orderId},
      data: {
        toAssetAmountTotalRemaining:
          newToRemaining > BigInt(0) ? newToRemaining : BigInt(0),
        fromAssetAmountTotalRemaining:
          newFromRemaining > BigInt(0) ? newFromRemaining : BigInt(0),
        toAssetAmountTotalFilled:
          (order.toAssetAmountTotalFilled ?? BigInt(0)) + params.toFilled,
        fromAssetAmountTotalFilled:
          (order.fromAssetAmountTotalFilled ?? BigInt(0)) + params.fromFilled,
        partialFillCount: hasDelta ? {increment: 1} : undefined,
        orderStatus:
          newToRemaining <= BigInt(0) && newFromRemaining <= BigInt(0)
            ? 'FILLED'
            : 'OPEN',
        transactionDateFill: hasDelta ? now : order.transactionDateFill,
        toAssetNetReceived: newNetReceived,
        pnlToAbs: pnlAbs,
        pnlToPct: pnlPct,
        updated: now,
      },
    });

    // Upsert fill row with actual amounts
    await prisma.twoWayOrderFill.upsert({
      where: {
        twoWayOrderId_txHash_txIndex: {
          twoWayOrderId: params.orderId,
          txHash: params.txHash,
          txIndex: params.txIndex,
        },
      },
      create: {
        twoWayOrderId: params.orderId,
        toAssetId: order.toAssetId,
        fromAssetId: order.fromAssetId,
        toAssetAmountFilled: params.toFilled,
        fromAssetAmountFilled: params.fromFilled,
        toAssetAmountUserReceived:
          typeof params.userReceiveTo === 'bigint'
            ? params.userReceiveTo
            : null,
        fromAssetAmountUserPaid:
          typeof params.userPayFrom === 'bigint' ? params.userPayFrom : null,
        toAssetFeeAmount:
          typeof params.feeTo === 'bigint' ? params.feeTo : null,
        fromAssetFeeAmount:
          typeof params.feeFrom === 'bigint' ? params.feeFrom : null,
        price: order.price ?? 0,
        priceNumerator: order.priceNumerator ?? null,
        priceDenominator: order.priceDenominator ?? null,
        txHash: params.txHash,
        txIndex: params.txIndex,
        slot: typeof params.slot === 'number' ? params.slot : 0,
      },
      update: {
        toAssetAmountFilled: params.toFilled,
        fromAssetAmountFilled: params.fromFilled,
        toAssetAmountUserReceived:
          typeof params.userReceiveTo === 'bigint'
            ? params.userReceiveTo
            : null,
        fromAssetAmountUserPaid:
          typeof params.userPayFrom === 'bigint' ? params.userPayFrom : null,
        toAssetFeeAmount:
          typeof params.feeTo === 'bigint' ? params.feeTo : null,
        fromAssetFeeAmount:
          typeof params.feeFrom === 'bigint' ? params.feeFrom : null,
        updated: now,
        slot: typeof params.slot === 'number' ? params.slot : 0,
      },
    });

    // Activity
    try {
      await prisma.twoWayOrderActivity.create({
        data: {
          twoWayOrderId: params.orderId,
          activityType: 'FILL',
          txHash: params.txHash,
          slot: typeof params.slot === 'number' ? params.slot : 0,
          message: `Order filled (fromFilled=${params.fromFilled.toString()} toFilled=${params.toFilled.toString()} userReceiveTo=${(
            params.userReceiveTo ?? BigInt(0)
          ).toString()} userPayFrom=${(
            params.userPayFrom ?? BigInt(0)
          ).toString()} feeTo=${(
            params.feeTo ?? BigInt(0)
          ).toString()} feeFrom=${(params.feeFrom ?? BigInt(0)).toString()})`,
        },
      });
    } catch (e) {
      // ignore logging/activity failure
    }
  }

  async markCancelledByConsumedUtxo(
    prisma: Prisma.TransactionClient,
    params: {inputTxHash: string; inputIndex: number}
  ): Promise<number> {
    const now = new Date();
    const result = await prisma.twoWayOrder.updateMany({
      where: {
        utxoReferenceTransactionHash: params.inputTxHash,
        utxoReferenceIndex: params.inputIndex,
        orderStatus: {in: ['OPEN', 'FILLED']},
      },
      data: {
        orderStatus: 'CANCELLED',
        transactionDateCancel: now,
        updated: now,
      },
    });
    try {
      this.logger.info(
        `[TWO-REPO][CANCEL] inputUtxo=${params.inputTxHash}#${params.inputIndex} affected=${result.count}`
      );
      const affectedOrders = await prisma.twoWayOrder.findMany({
        where: {
          utxoReferenceTransactionHash: params.inputTxHash,
          utxoReferenceIndex: params.inputIndex,
        },
        select: {twoWayOrderId: true},
      });
      for (const o of affectedOrders) {
        await prisma.twoWayOrderActivity.create({
          data: {
            twoWayOrderId: o.twoWayOrderId,
            activityType: 'CANCEL',
            txHash: params.inputTxHash,
            message: 'Order cancelled',
          },
        });
      }
    } catch (e) {
      // ignore logging/activity failure
    }
    return result.count;
  }

  async enrichOpenOrder(
    prisma: Prisma.TransactionClient,
    params: {
      txHash: string;
      outputIndex: number;
      fromAssetId?: string;
      fromAssetAmount?: bigint;
      toAssetId?: string;
      toAssetAmount?: bigint;
      price?: number;
      priceNumerator?: string;
      priceDenominator?: string;
      depositAmount?: bigint;
      makerLovelaceFlatFeeAmount?: bigint;
      takerLovelaceFlatFeeAmount?: bigint;
      makerFromAssetFeeAmount?: bigint;
      makerFromAssetFeePercent?: number;
      takerFromAssetFeeAmount?: bigint;
      takerFromAssetFeePercent?: number;
      effectiveFromDate?: Date | null;
      effectiveUntilDate?: Date | null;
    }
  ): Promise<void> {
    const data: Prisma.TwoWayOrderUpdateManyMutationInput = {};
    if (params.fromAssetId) data.fromAssetId = params.fromAssetId;
    if (typeof params.fromAssetAmount === 'bigint')
      data.fromAssetAmount = params.fromAssetAmount;
    if (params.toAssetId) data.toAssetId = params.toAssetId;
    if (typeof params.toAssetAmount === 'bigint')
      data.toAssetAmount = params.toAssetAmount;
    if (typeof params.price === 'number') data.price = params.price;
    if (params.priceNumerator !== undefined)
      data.priceNumerator = params.priceNumerator;
    if (params.priceDenominator !== undefined)
      data.priceDenominator = params.priceDenominator;
    if (typeof params.depositAmount === 'bigint')
      data.depositAmount = params.depositAmount;
    if (typeof params.makerLovelaceFlatFeeAmount === 'bigint')
      data.makerLovelaceFlatFeeAmount = params.makerLovelaceFlatFeeAmount;
    if (typeof params.takerLovelaceFlatFeeAmount === 'bigint')
      data.takerLovelaceFlatFeeAmount = params.takerLovelaceFlatFeeAmount;
    if (typeof params.makerFromAssetFeeAmount === 'bigint')
      data.makerFromAssetFeeAmount = params.makerFromAssetFeeAmount;
    if (typeof params.makerFromAssetFeePercent === 'number')
      data.makerFromAssetFeePercent = params.makerFromAssetFeePercent;
    if (typeof params.takerFromAssetFeeAmount === 'bigint')
      data.takerFromAssetFeeAmount = params.takerFromAssetFeeAmount;
    if (typeof params.takerFromAssetFeePercent === 'number')
      data.takerFromAssetFeePercent = params.takerFromAssetFeePercent;
    if (params.effectiveFromDate !== undefined)
      data.effectiveFromDate = params.effectiveFromDate;
    if (params.effectiveUntilDate !== undefined)
      data.effectiveUntilDate = params.effectiveUntilDate;

    // initialize totals if amounts provided
    if (typeof params.toAssetAmount === 'bigint')
      data.toAssetAmountTotalRemaining = params.toAssetAmount;
    if (typeof params.fromAssetAmount === 'bigint')
      data.fromAssetAmountTotalRemaining = params.fromAssetAmount;
    // filled totals remain 0

    if (Object.keys(data).length === 0) return;

    await prisma.twoWayOrder.updateMany({
      where: {
        utxoReferenceTransactionHash: params.txHash,
        utxoReferenceIndex: params.outputIndex,
      },
      data,
    });
    try {
      this.logger.info(
        `[TWO-REPO][ENRICH] tx=${params.txHash} outIdx=${params.outputIndex} fromAssetId=${params.fromAssetId} toAssetId=${params.toAssetId} price=${params.price}`
      );
    } catch (e) {
      // ignore logging failure
    }
  }

  async purgeEventsAfterSlot(
    prisma: Prisma.TransactionClient,
    slot: number
  ): Promise<number> {
    const res = await prisma.twoWayOrderEvent.deleteMany({
      where: {slot: {gt: slot}},
    });
    try {
      this.logger.debug(
        `[TWO-REPO][ROLLBACK] purgeEventsAfterSlot slot=${slot} deleted=${res.count}`
      );
    } catch (e) {
      // ignore logging failure
    }
    return res.count;
  }

  async purgeFillsAfterSlot(
    prisma: Prisma.TransactionClient,
    slot: number
  ): Promise<number> {
    const res = await prisma.twoWayOrderFill.deleteMany({
      where: {slot: {gt: slot}},
    });
    try {
      this.logger.debug(
        `[TWO-REPO][ROLLBACK] purgeFillsAfterSlot slot=${slot} deleted=${res.count}`
      );
    } catch (e) {
      // ignore logging failure
    }
    return res.count;
  }

  async purgeActivitiesAfterSlot(
    prisma: Prisma.TransactionClient,
    slot: number
  ): Promise<number> {
    const res = await prisma.twoWayOrderActivity.deleteMany({
      where: {slot: {gt: slot}},
    });
    try {
      this.logger.debug(
        `[TWO-REPO][ROLLBACK] purgeActivitiesAfterSlot slot=${slot} deleted=${res.count}`
      );
    } catch (e) {
      // ignore logging failure
    }
    return res.count;
  }

  private async revertUserOrdersOpenedAfterSlot(
    prisma: Prisma.TransactionClient,
    slot: number
  ): Promise<number> {
    const orders = await prisma.twoWayOrder.findMany({
      where: {
        userId: {not: null},
        openSlot: {gt: slot},
        orderStatus: {in: ['OPEN', 'FILLED', 'CANCELLED']},
      },
    });
    if (orders.length === 0) return 0;

    const now = new Date();
    let reverted = 0;

    for (const order of orders) {
      await prisma.twoWayOrderFill.deleteMany({
        where: {twoWayOrderId: order.twoWayOrderId},
      });
      await prisma.twoWayOrderActivity.deleteMany({
        where: {twoWayOrderId: order.twoWayOrderId},
      });
      await prisma.twoWayOrder.update({
        where: {twoWayOrderId: order.twoWayOrderId},
        data: {
          orderStatus: 'PENDING',
          transactionDateOpen: null,
          transactionDateFill: null,
          transactionDateCancel: null,
          openSlot: 0,
          utxoReferenceIndex: null,
          partialFillCount: 0,
          toAssetAmountTotalRemaining: order.toAssetAmount,
          fromAssetAmountTotalRemaining: order.fromAssetAmount,
          toAssetAmountTotalFilled: BigInt(0),
          fromAssetAmountTotalFilled: BigInt(0),
          toAssetNetReceived: BigInt(0),
          pnlToAbs: BigInt(0),
          pnlToPct: 0,
          updated: now,
        },
      });
      reverted++;
    }

    try {
      this.logger.info(
        `[TWO-REPO][ROLLBACK] revertedUserOrders count=${reverted} slot=${slot}`
      );
    } catch (e) {
      // ignore logging failure
    }

    return reverted;
  }

  async purgeFillsForOrdersOpenedAfterSlot(
    prisma: Prisma.TransactionClient,
    slot: number
  ): Promise<number> {
    // Delete fills that reference orders opened after the rollback slot to satisfy FK constraints
    const orders = await prisma.twoWayOrder.findMany({
      where: {
        openSlot: {gt: slot},
        orderStatus: {not: 'PENDING'},
        transactionDateOpen: {not: null},
        userId: null,
      },
      select: {twoWayOrderId: true},
    });
    if (orders.length === 0) return 0;
    const res = await prisma.twoWayOrderFill.deleteMany({
      where: {twoWayOrderId: {in: orders.map(o => o.twoWayOrderId)}},
    });
    try {
      this.logger.debug(
        `[TWO-REPO][ROLLBACK] purgeFillsForOrdersOpenedAfterSlot slot=${slot} deleted=${res.count}`
      );
    } catch (e) {
      // ignore logging failure
    }
    return res.count;
  }

  async purgeActivitiesForOrdersOpenedAfterSlot(
    prisma: Prisma.TransactionClient,
    slot: number
  ): Promise<number> {
    const orders = await prisma.twoWayOrder.findMany({
      where: {
        openSlot: {gt: slot},
        orderStatus: {not: 'PENDING'},
        transactionDateOpen: {not: null},
        userId: null,
      },
      select: {twoWayOrderId: true},
    });
    if (orders.length === 0) return 0;
    const res = await prisma.twoWayOrderActivity.deleteMany({
      where: {twoWayOrderId: {in: orders.map(o => o.twoWayOrderId)}},
    });
    try {
      this.logger.debug(
        `[TWO-REPO][ROLLBACK] purgeActivitiesForOrdersOpenedAfterSlot slot=${slot} deleted=${res.count}`
      );
    } catch (e) {
      // ignore logging failure
    }
    return res.count;
  }

  async purgeAllFills(prisma: Prisma.TransactionClient): Promise<number> {
    const res = await prisma.twoWayOrderFill.deleteMany({
      where: {
        twoWayOrder: {
          orderStatus: {not: 'PENDING'},
          transactionDateOpen: {not: null},
          userId: null,
        },
      },
    });
    return res.count;
  }

  async purgeAllActivities(prisma: Prisma.TransactionClient): Promise<number> {
    const res = await prisma.twoWayOrderActivity.deleteMany({
      where: {
        twoWayOrder: {
          orderStatus: {not: 'PENDING'},
          transactionDateOpen: {not: null},
          userId: null,
        },
      },
    });
    try {
      this.logger.debug(
        `[TWO-REPO][ROLLBACK] purgeAllActivities deleted=${res.count}`
      );
    } catch (e) {
      // ignore logging failure
    }
    return res.count;
  }

  async purgeOrdersOpenedAfterSlot(
    prisma: Prisma.TransactionClient,
    slot: number
  ): Promise<number> {
    const res = await prisma.twoWayOrder.deleteMany({
      where: {
        openSlot: {gt: slot},
        orderStatus: {not: 'PENDING'},
        transactionDateOpen: {not: null},
        userId: null,
      },
    });
    try {
      this.logger.debug(
        `[TWO-REPO][ROLLBACK] purgeOrdersOpenedAfterSlot slot=${slot} deleted=${res.count}`
      );
    } catch (e) {
      // ignore logging failure
    }
    return res.count;
  }

  async purgeAllOrders(prisma: Prisma.TransactionClient): Promise<number> {
    const res = await prisma.twoWayOrder.deleteMany({
      where: {
        orderStatus: {not: 'PENDING'},
        transactionDateOpen: {not: null},
        userId: null,
      },
    });
    try {
      this.logger.debug(
        `[TWO-REPO][ROLLBACK] purgeAllOrders deleted=${res.count}`
      );
    } catch (e) {
      // ignore logging failure
    }
    return res.count;
  }

  async rollbackToSlot(
    prisma: Prisma.TransactionClient,
    slot: number
  ): Promise<{
    deletedFills: number;
    deletedEvents: number;
    deletedOrdersOpenAfter: number;
    rebuiltOrders: number;
  }> {
    const deletedFillsAfterSlot = await this.purgeFillsAfterSlot(prisma, slot);
    const deletedEvents = await this.purgeEventsAfterSlot(prisma, slot);
    await this.purgeActivitiesAfterSlot(prisma, slot);
    const deletedFillsForOpenedAfter =
      await this.purgeFillsForOrdersOpenedAfterSlot(prisma, slot);
    await this.purgeActivitiesForOrdersOpenedAfterSlot(prisma, slot);
    await this.revertUserOrdersOpenedAfterSlot(prisma, slot);
    const deletedOrdersOpenAfter = await this.purgeOrdersOpenedAfterSlot(
      prisma,
      slot
    );

    // Ensure all remaining fills are removed before purging orders to satisfy FK constraints
    const deletedFillsAll = await this.purgeAllFills(prisma);
    // Ensure all remaining activities are removed before purging orders
    await this.purgeAllActivities(prisma);
    await this.purgeAllOrders(prisma);
    const rebuiltOrders = await this.rebuildProjectionFromEventsUpToSlot(
      prisma,
      slot
    );

    const deletedFills =
      deletedFillsAfterSlot + deletedFillsForOpenedAfter + deletedFillsAll;
    // we don't currently return deletedActivities count to caller; can be added if needed
    return {deletedFills, deletedEvents, deletedOrdersOpenAfter, rebuiltOrders};
  }

  private async rebuildProjectionFromEventsUpToSlot(
    prisma: Prisma.TransactionClient,
    slot: number
  ): Promise<number> {
    const events = await prisma.twoWayOrderEvent.findMany({
      where: {slot: {lte: slot}},
      orderBy: [{slot: 'asc'}],
    });

    let createdCount = 0;

    for (const ev of events) {
      try {
        const parsedEvent: Oura.Event = JSON.parse(ev.payloadJson);
        if (!Oura.isTransactionEvent(parsedEvent)) continue;
        const tx: Oura.Transaction = parsedEvent.transaction;
        if (ev.eventType === 'CREATE') {
          const outputIndex = ev.txIndex ?? 0;
          const {updated, isUserOrder} = await this.createOpenFromTx(prisma, {
            txHash: ev.txHash,
            outputIndex,
            slot: ev.slot,
            blockHash: parsedEvent.context?.block_hash,
          });
          if (updated && !isUserOrder) {
            const out = Array.isArray(tx?.outputs)
              ? tx.outputs[outputIndex]
              : undefined;
            if (out) {
              const adaLovelace = BigInt(out.amount ?? 0);
              const assets = Array.isArray(out.assets) ? out.assets : [];
              const nonAda = assets.filter(a => a && a.policy && a.asset);
              const biggest = nonAda.sort(
                (a, b) => Number(b?.amount ?? 0) - Number(a?.amount ?? 0)
              )[0];
              const fromAssetId = biggest
                ? `${biggest.policy}.${biggest.asset}`
                : undefined;
              const fromAssetAmount = biggest
                ? BigInt(biggest.amount ?? 0)
                : undefined;
              const toAssetId = 'lovelace';
              const toAssetAmount = adaLovelace;
              const price =
                biggest && Number(fromAssetAmount ?? 0) > 0
                  ? Number(toAssetAmount) / Number(fromAssetAmount)
                  : undefined;
              const effectiveFromDate = null;
              const effectiveUntilDate = null;
              await this.enrichOpenOrder(prisma, {
                txHash: ev.txHash,
                outputIndex,
                fromAssetId,
                fromAssetAmount,
                toAssetId,
                toAssetAmount,
                price,
                effectiveFromDate,
                effectiveUntilDate,
              });
            }
          }
          if (updated) createdCount++;
        } else if (ev.eventType === 'FILL') {
          const inp = Array.isArray(tx?.inputs)
            ? tx.inputs[ev.txIndex ?? 0]
            : undefined;
          const consumedTxHash = inp?.tx_id ?? ev.txHash;
          const consumedIndex =
            typeof inp?.index === 'number' ? inp.index : ev.txIndex ?? 0;
          await this.markFilledByConsumedUtxo(prisma, {
            inputTxHash: consumedTxHash,
            inputIndex: consumedIndex,
            slot: ev.slot,
            txHash: ev.txHash,
            txIndex: ev.txIndex ?? consumedIndex,
          });
        } else if (ev.eventType === 'CANCEL') {
          const inp = Array.isArray(tx?.inputs)
            ? tx.inputs[ev.txIndex ?? 0]
            : undefined;
          const consumedTxHash = inp?.tx_id ?? ev.txHash;
          const consumedIndex =
            typeof inp?.index === 'number' ? inp.index : ev.txIndex ?? 0;
          await this.markCancelledByConsumedUtxo(prisma, {
            inputTxHash: consumedTxHash,
            inputIndex: consumedIndex,
          });
        }
      } catch {
        // continue on parse/apply error to avoid blocking replay
      }
    }

    return createdCount;
  }

  private getMintAssetIdFromTransaction(
    transaction?: Oura.Transaction
  ): string | null {
    if (!transaction || !Array.isArray(transaction.mint)) return null;
    const minted = transaction.mint.find(
      m => m && typeof m.quantity === 'number' && m.quantity > 0
    );
    if (!minted || !minted.policy || !minted.asset) return null;
    return `${minted.policy}.${minted.asset}`;
  }
}
