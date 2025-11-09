import {Hex} from '~/domain/models/cardano';

export type PlutusData = {
  datum_hash: Hex | null;
  plutus_data: PlutusDataField | null;
};

// Recursive representation of Plutus data based on observed Oura logs
// Permissive shape to match existing parsers (fields access without exhaustive narrowing)
export type PlutusDataField = {
  constructor?: number;
  map?: Record<string, PlutusDataField>[];
  int?: number;
  bytes?: Hex;
  fields?: PlutusDataField[];
  list?: PlutusDataField[];
};
