import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {PrismaClient} from '@prisma/client';

import {ConfigService, bigIntStringifyReplacer} from '~/domain/services';

import {AbstractQuery} from '~/implementation/fastify/abstract.query';

@singleton()
export class TwoWayOrderQueryFastify extends AbstractQuery {
  constructor(
    @inject('PrismaClient') readonly prisma: PrismaClient,
    @inject('ConfigService') readonly configService: ConfigService
  ) {
    super(configService);
  }

  async list(
    req: FastifyRequest<{
      Querystring: {
        filterByWalletStakeKeyHash?: string;
        filterByOwner?: boolean;
      };
    }>
  ): Promise<unknown[]> {
    const anyReq = req as unknown as Record<string, unknown>;
    const user =
      (anyReq.user as {walletStakeKeyHash?: string | null} | null) || null;
    const query = (anyReq.query as {
      filterByWalletStakeKeyHash?: string;
      filterByOwner?: boolean;
    }) || {filterByOwner: false};

    if (query.filterByOwner && query.filterByWalletStakeKeyHash) {
      throw new Error('ORDER__FILTER_BY_WALLET_AND_OWNER');
    }

    const walletStakeKeyHash =
      query.filterByWalletStakeKeyHash ||
      (query.filterByOwner ? user?.walletStakeKeyHash || undefined : undefined);

    const where = walletStakeKeyHash ? {user: {walletStakeKeyHash}} : undefined;

    const orders = await this.prisma.twoWayOrder.findMany({
      where,
      orderBy: {created: 'desc'},
      select: {
        twoWayOrderId: true,
        toAssetId: true,
        fromAssetId: true,
        toAssetAmount: true,
        fromAssetAmount: true,
        toAssetAmountTotalRemaining: true,
        fromAssetAmountTotalRemaining: true,
        toAssetAmountTotalFilled: true,
        fromAssetAmountTotalFilled: true,
        price: true,
        priceNumerator: true,
        priceDenominator: true,
        orderStatus: true,
        mintAssetId: true,
        depositAmount: true,
        makerLovelaceFlatFeeAmount: true,
        makerFromAssetFeePercent: true,
        makerFromAssetFeeAmount: true,
        takerLovelaceFlatFeeAmount: true,
        takerFromAssetFeePercent: true,
        takerFromAssetFeeAmount: true,
        utxoReferenceTransactionHash: true,
        utxoReferenceIndex: true,
        effectiveFromDate: true,
        effectiveUntilDate: true,
        partialFillCount: true,
        orderDate: true,
        transactionDateOpen: true,
        transactionDateFill: true,
        transactionDateCancel: true,
        created: true,
        updated: true,
        toAssetNetReceived: true,
        pnlToAbs: true,
        pnlToPct: true,
      },
    });
    return JSON.parse(JSON.stringify(orders, bigIntStringifyReplacer));
  }

  async getById(
    req: FastifyRequest<{Params: {orderId: string}}>
  ): Promise<unknown> {
    const {orderId} = req.params;
    const order = await this.prisma.twoWayOrder.findUnique({
      where: {twoWayOrderId: orderId},
      select: {
        twoWayOrderId: true,
        toAssetId: true,
        fromAssetId: true,
        toAssetAmount: true,
        fromAssetAmount: true,
        toAssetAmountTotalRemaining: true,
        fromAssetAmountTotalRemaining: true,
        toAssetAmountTotalFilled: true,
        fromAssetAmountTotalFilled: true,
        price: true,
        orderStatus: true,
        partialFillCount: true,
        created: true,
        updated: true,
        toAssetNetReceived: true,
        pnlToAbs: true,
        pnlToPct: true,
      },
    });
    return order
      ? JSON.parse(JSON.stringify(order, bigIntStringifyReplacer))
      : {};
  }

  async history(
    req: FastifyRequest<{Params: {orderId: string}}>
  ): Promise<unknown[]> {
    const {orderId} = req.params;
    const [items, order, fills] = await Promise.all([
      this.prisma.twoWayOrderActivity.findMany({
        where: {twoWayOrderId: orderId},
        orderBy: {created: 'asc'},
        select: {
          twoWayOrderActivityId: true,
          activityType: true,
          txHash: true,
          slot: true,
          message: true,
          created: true,
        },
      }),
      this.prisma.twoWayOrder.findUnique({
        where: {twoWayOrderId: orderId},
        select: {toAssetAmount: true},
      }),
      this.prisma.twoWayOrderFill.findMany({
        where: {twoWayOrderId: orderId},
        orderBy: {transactionDateFill: 'asc'},
        select: {
          txHash: true,
          transactionDateFill: true,
          toAssetAmountFilled: true,
          fromAssetAmountFilled: true,
          toAssetAmountUserReceived: true,
          fromAssetAmountUserPaid: true,
          toAssetFeeAmount: true,
          fromAssetFeeAmount: true,
        },
      }),
    ]);
    const initialTo = BigInt(order?.toAssetAmount ?? 0);
    let cumulativeNetTo = BigInt(0);
    const fillByTx = new Map<
      string,
      {
        fromFilled: string | null;
        toFilled: string | null;
        userReceiveTo: string | null;
        userPayFrom: string | null;
        feeTo: string | null;
        feeFrom: string | null;
        userReceiveToNet: string;
        userPayFromNet: string;
        pnlToAbs: string;
        pnlToPct: number;
      }
    >();
    for (const f of fills) {
      const toFilled = BigInt(f.toAssetAmountFilled ?? 0);
      const userReceiveTo = BigInt(f.toAssetAmountUserReceived ?? 0);
      const feeTo = BigInt(f.toAssetFeeAmount ?? 0);
      const netDelta =
        userReceiveTo > BigInt(0)
          ? userReceiveTo <= toFilled
            ? userReceiveTo
            : toFilled
          : toFilled - feeTo > BigInt(0)
          ? toFilled - feeTo
          : BigInt(0);
      cumulativeNetTo += netDelta;
      const pnlAbs = cumulativeNetTo - initialTo;
      const pnlPct =
        Number(initialTo > 0n ? (pnlAbs * 10000n) / initialTo : 0n) / 100;
      const userReceiveToNet =
        userReceiveTo > BigInt(0)
          ? userReceiveTo <= toFilled
            ? userReceiveTo
            : toFilled
          : toFilled - feeTo > BigInt(0)
          ? toFilled - feeTo
          : BigInt(0);
      const userPayFromNet =
        BigInt(f.fromAssetAmountUserPaid ?? 0) > BigInt(0)
          ? BigInt(f.fromAssetAmountUserPaid ?? 0) <=
            BigInt(f.fromAssetAmountFilled ?? 0)
            ? BigInt(f.fromAssetAmountUserPaid ?? 0)
            : BigInt(f.fromAssetAmountFilled ?? 0)
          : BigInt(f.fromAssetAmountFilled ?? 0) -
              BigInt(f.fromAssetFeeAmount ?? 0) >
            BigInt(0)
          ? BigInt(f.fromAssetAmountFilled ?? 0) -
            BigInt(f.fromAssetFeeAmount ?? 0)
          : BigInt(0);
      fillByTx.set(f.txHash, {
        fromFilled: f.fromAssetAmountFilled?.toString?.() ?? null,
        toFilled: f.toAssetAmountFilled?.toString?.() ?? null,
        userReceiveTo: f.toAssetAmountUserReceived?.toString?.() ?? null,
        userPayFrom: f.fromAssetAmountUserPaid?.toString?.() ?? null,
        feeTo: f.toAssetFeeAmount?.toString?.() ?? null,
        feeFrom: f.fromAssetFeeAmount?.toString?.() ?? null,
        userReceiveToNet: userReceiveToNet.toString(),
        userPayFromNet: userPayFromNet.toString(),
        pnlToAbs: pnlAbs.toString(),
        pnlToPct: pnlPct,
      });
    }

    const mapped = items.map(it => {
      const base: {
        twoWayOrderActivityId: string;
        activityType: string;
        txHash: string | null;
        slot: number | null;
        created: Date;
      } = {
        twoWayOrderActivityId: it.twoWayOrderActivityId,
        activityType: it.activityType,
        txHash: it.txHash,
        slot: it.slot,
        created: it.created,
      };
      if (it.activityType === 'OPEN') return {...base, message: 'Order opened'};
      if (it.activityType === 'CANCEL')
        return {...base, message: 'Order cancelled'};
      const f = it.txHash ? fillByTx.get(it.txHash) : undefined;
      return {
        ...base,
        message: 'Order filled',
        fromFilled: f?.fromFilled ?? null,
        toFilled: f?.toFilled ?? null,
        userReceiveTo: f?.userReceiveTo ?? null,
        userPayFrom: f?.userPayFrom ?? null,
        feeTo: f?.feeTo ?? null,
        feeFrom: f?.feeFrom ?? null,
        userReceiveToNet: f?.userReceiveToNet ?? null,
        userPayFromNet: f?.userPayFromNet ?? null,
        pnlToAbs: f?.pnlToAbs ?? null,
        pnlToPct: typeof f?.pnlToPct === 'number' ? f.pnlToPct : null,
      };
    });
    return mapped;
  }

  // SLV balance (MVP): aggregate totalsRemaining by toAssetId across OPEN orders
  async slvBalance(
    _req: FastifyRequest
  ): Promise<Array<{assetId: string; amount: string}>> {
    const openOrders = await this.prisma.twoWayOrder.findMany({
      where: {orderStatus: 'OPEN'},
      select: {toAssetId: true, toAssetAmountTotalRemaining: true},
    });
    const map = new Map<string, bigint>();
    for (const o of openOrders) {
      const key = o.toAssetId;
      const val = BigInt(o.toAssetAmountTotalRemaining ?? 0);
      map.set(key, (map.get(key) ?? BigInt(0)) + val);
    }
    return Array.from(map.entries()).map(([assetId, amount]) => ({
      assetId,
      amount: amount.toString(),
    }));
  }
}
