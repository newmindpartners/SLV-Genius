export interface Transaction {
  tx_fee: string;
  tx_hash: string;
  tx_mints: TransactionMint[];
  tx_inputs: TransactionInput[];
  tx_outputs: TransactionOutput[];
}

export interface TransactionMint {
  asset: string;
  policy: string;
  quantity: number;
}

export interface TransactionInput {
  input_index: number;
  input_tx_hash: string;
  output_index: number;
  output_tx_hash: string;
}

export interface TransactionOutput {
  index: number;
  tx_hash: string;
  address: string;
}

// Request / Response payload for POST `/tx/submit`
export type SubmitTransactionRequest = {
  walletWitness: string;
  originalUnsignedTx: string;
};
export type SubmitTransactionResponse = Transaction;
