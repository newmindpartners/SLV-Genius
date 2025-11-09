import {
  AbstractRequest,
  AbstractResponseTransaction,
  DepositResponse,
  MakerFeeResponse,
  TakerFeeResponse,
  ScriptAddressResponse,
} from './abstract';

// -- SWAP ORDER -- //

// Request payload for POST `/DEX/order/{cancel|place}`

export type OrderSwapRequest = AbstractRequest;

export interface OrderSwapResponseTransaction
  extends AbstractResponseTransaction,
    ScriptAddressResponse {}

export interface OrderSwapResponseMakerTransaction
  extends OrderSwapResponseTransaction,
    DepositResponse,
    MakerFeeResponse {}

export interface OrderSwapResponseTakerTransaction
  extends OrderSwapResponseTransaction,
    TakerFeeResponse {}

// Request / Response payload for POST `/DEX/order/place`
export type OrderSwapOpenRequest = OrderSwapRequest &
  OrderSwapOpenRequestParams;
export interface OrderSwapOpenRequestParams {
  offerAmount: string; // unit
  offerSymbol: string; // policyId
  offerToken: string; //  assetName
  priceAmount: string; // unit
  priceSymbol: string; // policyId
  priceToken: string; //  assetName
  orderVersion: string; // scriptVersion
  end?: string;
  start?: string;
}
export type OrderSwapOpenResponse = OrderSwapResponseMakerTransaction;

// Request / Response payload for POST `/DEX/order/fill`
export type OrderSwapFillRequest = OrderSwapRequest &
  OrderSwapFillRequestParams;
export interface OrderSwapFillRequestParams {
  utxoRef: string; // transactionHash#index
  offerFillAmount: string; // unit
}
export type OrderSwapFillResponse = OrderSwapResponseTakerTransaction;

// Request payload for POST `/DEX/order/multiLimitFill`
export type OrderSwapMultiFillRequest = OrderSwapRequest & {
  utxoRefsWithAmt: Array<[string, string]>;
};

// Request / Response payload for POST `/DEX/order/cancel`
export type OrderSwapCancelRequest = OrderSwapRequest &
  OrderSwapCancelRequestParams;
export interface OrderSwapCancelRequestParams {
  utxoRef: string; // transactionHash#index
}
export type OrderSwapCancelResponse = AbstractResponseTransaction;
