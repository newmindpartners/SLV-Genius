import {
  DepositResponse,
  AbstractRequest,
  AbstractResponseTransaction,
  ScriptAddressResponse,
} from './abstract';

// Request payload for POST `/tokenSale/order/{cancel|place}`

export interface OrderSaleRequest extends AbstractRequest {
  params: OrderSaleParams;
}

// `params` field for requests to `/tokenSale/order/{cancel|place}`
export interface OrderSaleParams {
  beginSale: string;
  endDistribution: string;
  endSale: string;
  fee: string;
  feeAddress: string;
  minAllocation: number;
  price: string;
  sellerKey: string;
  token: string;
}

export interface OrderSaleResponseTransaction
  extends AbstractResponseTransaction,
    DepositResponse,
    ScriptAddressResponse {}

// Request / Response payload for POST `/tokenSale/order/place`
export interface OrderSalePlaceRequest extends OrderSaleRequest {
  offer: number;
  unusedAddrs: string[];
}

export type OrderSalePlaceResponse = OrderSaleResponseTransaction;

// Request / Response payload for POST `/tokenSale/order/cancel`
export interface OrderSaleCancelRequest extends OrderSaleRequest {
  utxoRef: string;
}

export type OrderSaleCancelResponse = AbstractResponseTransaction;

// Request / Response payload for POST `/tokenSale/order/info`
export type OrderSaleInfoRequest = OrderSaleParams;
export type OrderSaleInfoResponse = ScriptAddressResponse;
