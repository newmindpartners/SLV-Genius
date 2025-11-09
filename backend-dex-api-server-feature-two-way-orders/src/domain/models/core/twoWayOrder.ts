import {AbstractRequest} from './abstract';
import {
  OrderRequest,
  OrderToFromAssetAmount,
  OrderToFromAssetIdNamePolicyId,
} from './order';

export type TwoWayOrderPlaceRequest = AbstractRequest &
  OrderToFromAssetIdNamePolicyId &
  OrderToFromAssetAmount & {
    effectiveFromDate?: string; // ISO8601
    effectiveUntilDate?: string; // ISO8601
    straightPrice?: string;
  };

export type TwoWayOrderFillRequest = OrderRequest & {
  utxoReference: string; // txHash#index
};

export type TwoWayOrderCancelRequest = OrderRequest & {
  utxoReference: string; // txHash#index
};
