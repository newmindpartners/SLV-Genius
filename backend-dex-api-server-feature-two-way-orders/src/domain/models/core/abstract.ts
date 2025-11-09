import {UnspentTransactionOutput} from '~/domain/models/cardano';

import * as Public from '~/domain/models/public';

export type AbstractRequest = Public.WalletAccount;

export type UnspentTransactionOutputRequest = {
  utxoReference: UnspentTransactionOutput;
};
