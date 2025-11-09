import {AbstractRequest} from './abstract';

export type ToAssetIdNamePolicyId =
  | 'toAssetId'
  | 'toAssetName'
  | 'toAssetPolicyId';

export type OrderToAsset = {
  toAssetId: string;
  toAssetName: string;
  toAssetPolicyId: string;
};

export type FromAssetIdNamePolicyId =
  | 'fromAssetId'
  | 'fromAssetName'
  | 'fromAssetPolicyId';

export type OrderFromAsset = {
  fromAssetId: string;
  fromAssetName: string;
  fromAssetPolicyId: string;
};

export type OrderToFromAssetIdNamePolicyId = Pick<
  OrderToAsset,
  ToAssetIdNamePolicyId
> &
  Pick<OrderFromAsset, FromAssetIdNamePolicyId>;

export type ToFromAssetAmount = 'toAssetAmount' | 'fromAssetAmount';

export type OrderToAssetAmount = {
  toAssetAmount: string;
};

export type OrderFromAssetAmount = {
  fromAssetAmount: string;
};

export type OrderToFromAssetAmount = OrderToAssetAmount & OrderFromAssetAmount;

export type OrderRequest = AbstractRequest;

export type OrderScriptVersion = {
  orderVersion: string;
};
