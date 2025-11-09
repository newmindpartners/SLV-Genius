import {Prisma} from '@prisma/client';
import {flatten, map, uniq} from 'lodash';
import {EventStream, OrderSwapEvent} from '~/domain/events';
import * as loFp from 'lodash/fp';
import {KeysOfUnion, WithNonNullable} from '~/implementation/utils/typescript';

const isFalse = (value: unknown) => !!value === false;

export type OrderSwapReference = Pick<OrderSwap, 'orderSwapId'>;

export type UtxoRef = Pick<
  OrderSwap,
  'utxoReferenceTransactionHash' | 'utxoReferenceIndex'
>;

export const getUtxoRef = ({
  utxoReferenceIndex,
  utxoReferenceTransactionHash,
}: OrderSwap) => `${utxoReferenceTransactionHash}#${utxoReferenceIndex}`;

// Order swap
export type OrderSwap = Prisma.OrderSwapGetPayload<{}>;

export type OrderSwapCreate = Prisma.OrderSwapUncheckedCreateInput;
export type OrderSwapUpdate = Prisma.OrderSwapUncheckedUpdateInput;

// Valid order swap
// Order swap (fill or limit) with minimum data required to display
export type OrderSwapRequiredToBeValid = {
  orderType: NonNullable<OrderSwap['orderType']>;
  orderStatus: NonNullable<OrderSwap['orderStatus']>;
};

export type ValidOrderSwap = Omit<
  OrderSwap,
  KeysOfUnion<OrderSwapRequiredToBeValid>
> &
  OrderSwapRequiredToBeValid;

export type ValidOrderSwapWithEventStream = {
  orderSwap: ValidOrderSwap;
  streamEvents: EventStream<OrderSwapEvent>['streamEvents'];
};

export const isValidOrderSwap = (
  orderSwap: OrderSwap
): orderSwap is ValidOrderSwap =>
  loFp.flow(
    loFp.pick(['orderType', 'orderStatus']),
    loFp.map(loFp.isNull),
    loFp.every(isFalse)
  )(orderSwap);

// Onchain order swap
// Limit order swap with on chain data
export type OnchainLimitOrderSwap = WithNonNullable<
  ValidOrderSwap,
  'mintAssetId'
>;

export const isOnchainLimitOrderSwap = (
  orderSwap: OrderSwap
): orderSwap is OnchainLimitOrderSwap =>
  isValidOrderSwap(orderSwap) &&
  loFp.flow(
    loFp.pick(['mintAssetId']),
    loFp.map(loFp.isNull),
    loFp.every(isFalse)
  )(orderSwap);

export const getOrdersSwapAssetIds = (orderSwaps: OrderSwap[]): string[] =>
  uniq(
    flatten(
      map(orderSwaps, ({toAssetId, fromAssetId}) => {
        return [toAssetId, fromAssetId];
      })
    )
  );
