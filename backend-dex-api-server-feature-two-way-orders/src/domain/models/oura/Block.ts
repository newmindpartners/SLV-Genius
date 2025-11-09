import {Hex} from '~/domain/models/cardano';
import {Transaction} from './Transaction';

export type Block = {
  era: string;
  epoch: number;
  epoch_slot: number;
  body_size: number;
  issuer_vkey: Hex;
  vrf_vkey: Hex;
  tx_count: number;
  slot: number;
  hash: Hex;
  number: number;
  previous_hash: Hex;
  cbor_hex: Hex | null;
  transactions: Hex[] | Transaction[] | null;
};
