import {Hex} from '~/domain/models/cardano';

export type TransactionInput = {
  tx_id: Hex;
  index: number;
};
