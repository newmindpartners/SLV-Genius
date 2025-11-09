import {UnspentTransactionOutputRequest} from './abstract';
import * as Public from '~/domain/models/public';

import {
  OrderToAsset,
  OrderToAssetAmount,
  OrderToFromAssetAmount,
  OrderToFromAssetIdNamePolicyId,
  OrderFromAsset,
  OrderFromAssetAmount,
  OrderRequest,
  OrderScriptVersion,
} from './order';

export type OrderSwapRequestTemplate = OrderToFromAssetAmount &
  OrderToFromAssetIdNamePolicyId;

export type OrderSwapRequest = OrderRequest;

export type OrderSwapOpenRequest = OrderSwapRequest &
  OrderSwapRequestTemplate &
  OrderScriptVersion &
  Public.EffectiveDates;

export type OrderSwapFillRequest = OrderSwapRequest &
  OrderToAssetAmount &
  UnspentTransactionOutputRequest;

export type OrderSwapMultiFillRequest = OrderSwapRequest & {
  utxoRefsWithAmt: UtxoRefsWithAmt;
};

export type UtxoRefsWithAmt = Array<
  OrderToAssetAmount & UnspentTransactionOutputRequest
>;

export type OrderSwapCancelRequest = OrderSwapRequest &
  UnspentTransactionOutputRequest;

export type ToAssetAndAmount = OrderToAsset & OrderToAssetAmount;
export type FromAssetAndAmount = OrderFromAsset & OrderFromAssetAmount;
