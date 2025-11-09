import {Hex} from '~/domain/models/cardano';

export type RollBack = {
  block_slot: number;
  block_hash: Hex;
};
