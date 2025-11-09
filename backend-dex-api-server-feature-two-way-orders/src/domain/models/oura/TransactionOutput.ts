import {OutputAsset} from './OutputAsset';
import {PlutusData} from './PlutusData';

export type TransactionOutput = {
  address: string;
  amount: number;
  datum_hash: string | null;
  inline_datum: PlutusData | null;
  assets: OutputAsset[];
};

export type TransactionOutputWithRef = TransactionOutput & {
  utxoReferenceTransactionHash: string;
  utxoReferenceIndex: number;
};

export const emptyTransactionOutputs: TransactionOutput[] = [];
