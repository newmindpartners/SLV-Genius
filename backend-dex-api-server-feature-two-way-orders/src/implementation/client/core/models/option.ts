import {AbstractResponseTransaction} from './abstract';

export type OptionResponse = {
  tScriptAddress: string;
  tx_valid_until: string;
}

export type CreateOptionRequest = {
  depositSymbol: string;
  depositToken: string;
  paymentSymbol: string;
  paymentToken: string;
  price: string;
  amount: number;

  start: string;
  end: string;

  usedAddrs: string[];
  change: string;
  collateral: string;
};
export type CreateOptionResponse = AbstractResponseTransaction & OptionResponse

export type ExecuteOptionRequest = {
  amount: number;
  usedAddrs: string[];
  change: string;
  collateral: string;
  ref: string;
};
export type ExecuteOptionResponse = AbstractResponseTransaction & OptionResponse

export type RetrieveOptionRequest = {
  amount: number;
  usedAddrs: string[];
  change: string;
  collateral: string;
  ref: string;
};
export type RetrieveOptionResponse = AbstractResponseTransaction & OptionResponse
