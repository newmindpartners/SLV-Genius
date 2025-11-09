import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {Identity} from '~/domain/utils/typescript.util';

// -- ALL -- //

export type UnsignedTransaction = Private.TransactionFee & {
  transactionId: string;
  transactionPayload: string;
};

// -- SALE -- //

export type UnsignedTransactionSaleOrderOpen = Private.UnsignedTransaction &
  Public.SaleOrderTotalFeesDeposit &
  Private.ScriptAddress;

export type UnsignedTransactionSaleOrderCancel = Private.UnsignedTransaction;

// -- SWAP -- //

export type UnsignedTransactionSwapOrderOpen = {
  transactionFeeAmount: string;
  transactionId: string;
  transactionPayload: string;
  makerLovelaceFlatFeeAmount: string;
  makerFromAssetFeeAmount: string;
  makerFromAssetFeePercent: string;
  depositAmount: string;
};

export type UnsignedTransactionSwapOrderFill = {
  transactionFeeAmount: string;
  transactionId: string;
  transactionPayload: string;
  takerLovelaceFlatFeeAmount: string;
  takerFromAssetFeeAmount: string;
  takerFromAssetFeePercent: string;
};

export type UnsignedTransactionSwapOrderCancel = Private.UnsignedTransaction;
