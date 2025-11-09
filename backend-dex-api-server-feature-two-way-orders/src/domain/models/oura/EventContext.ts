import {Bech32, Hex} from '~/domain/models/cardano';

export type EventContext = {
  block_hash: Hex;
  block_number: number;
  slot: number;
  timestamp: number;
  tx_idx: number | null;
  tx_hash: Hex | null;
  input_idx: number | null;
  output_idx: number | null;
  output_address: Bech32 | null;
  certificate_idx: number | null;
};
