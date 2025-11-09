import {Hex} from '~/domain/models/cardano';

import {MintAsset} from './MintAsset';
import {PlutusData} from './PlutusData';
import {PlutusRedeemer} from './PlutusRedeemer';
import {TransactionInput} from './TransactionInput';
import {TransactionOutput} from './TransactionOutput';

export type Transaction = {
  fee: number;
  hash: Hex;
  mint: MintAsset[] | null;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  plutus_data: PlutusData[] | null;
  plutus_redeemers: PlutusRedeemer[] | null;
};
