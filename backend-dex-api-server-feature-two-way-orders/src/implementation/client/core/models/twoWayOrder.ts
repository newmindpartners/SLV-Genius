import {
  AbstractRequest,
  AbstractResponseTransaction,
  DepositResponse,
  MakerFeeResponse,
  ScriptAddressResponse,
  TakerFeeResponse,
} from './abstract';

// -- TWO-WAY ORDER -- //

export type TwoWayOrderRequest = AbstractRequest;

export interface TwoWayOrderResponseTransaction
  extends AbstractResponseTransaction,
    ScriptAddressResponse {}

export interface TwoWayOrderResponseMakerTransaction
  extends TwoWayOrderResponseTransaction,
    DepositResponse,
    MakerFeeResponse {}

export interface TwoWayOrderResponseTakerTransaction
  extends TwoWayOrderResponseTransaction,
    TakerFeeResponse {}

// Request / Response payload for POST `/DEX/two-way-order/place`
export type TwoWayOrderPlaceRequest = TwoWayOrderRequest &
  TwoWayOrderPlaceParams;
export interface TwoWayOrderPlaceParams {
  offerAmount: string; // unit
  offerSymbol: string; // policyId
  offerToken: string; // assetName
  priceAmount: string; // unit
  priceSymbol: string; // policyId
  priceToken: string; // assetName
  straightPrice?: string;
  end?: string; // ISO8601
  start?: string; // ISO8601
  rewardAddrs?: string[]; // stake addresses
}
export type TwoWayOrderPlaceResponse = TwoWayOrderResponseMakerTransaction;

// Request / Response payload for POST `/DEX/two-way-order/fill`
export type TwoWayOrderFillRequest = TwoWayOrderRequest & TwoWayOrderFillParams;
export interface TwoWayOrderFillParams {
  utxoRef: string; // transactionHash#index
}
export type TwoWayOrderFillResponse = TwoWayOrderResponseTakerTransaction;

// Request / Response payload for POST `/DEX/two-way-order/cancel`
export type TwoWayOrderCancelRequest = TwoWayOrderRequest &
  TwoWayOrderCancelParams;
export interface TwoWayOrderCancelParams {
  utxoRef: string; // transactionHash#index
}
export type TwoWayOrderCancelResponse = AbstractResponseTransaction;
