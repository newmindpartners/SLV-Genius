import {Hex} from '~/domain/models/cardano';

export type TransactionSubmitRequest = {
  transactionPayload: string;
  transactionSignature: string;
};

export type Transaction = {
  transactionHash: Hex;

  transactionMint: TransactionMint[];
  transactionInputs: TransactionInput[];
  transactionOutputs: TransactionOutput[];

  transactionFeeAmount: string;
};

export type TransactionMint = {
  mintAssetId: string;
};

export type TransactionInput = {
  inputIndex: number;
  inputTransactionHash: string;

  outputIndex: number;
  outputTransactionHash: string;
};

export type TransactionOutput = {
  index: number;
  address: string;
  transactionHash: Hex;
};
