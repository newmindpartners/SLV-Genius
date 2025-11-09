import {Transaction} from './transaction';

export interface AbstractRequest {
  change: string;
  collateral: string | null;
  usedAddrs: string[];
  unusedAddrs?: string[];
}

export interface AbstractResponse {
  tTx: string;
  tx_fee: string;
}

export interface AbstractResponseTransaction
  extends AbstractResponse,
    Transaction {}

export interface DepositResponse {
  depositAmount: string;
}

export type MakerFeeResponse = {
  makerLovelaceFlatFee: string;
  makerOfferedFeeAmount: string;
  makerOfferedFeePercent: string;
};

export type TakerFeeResponse = {
  takerLovelaceFlatFee: string;
  takerOfferedFeeAmount: string;
  takerOfferedFeePercent: string;
};

export interface ScriptAddressResponse {
  tScriptAddress: string;
}
