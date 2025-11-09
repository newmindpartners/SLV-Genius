import {PlutusDataField} from './PlutusData';

export const PlutusRedeemerPurposes = {
  mint: 'mint',
  spend: 'spend',
};

export type PlutusRedeemerPurpose =
  (typeof PlutusRedeemerPurposes)[keyof typeof PlutusRedeemerPurposes];

export type PlutusRedeemer = {
  purpose: PlutusRedeemerPurpose;
  ex_units_mem: number;
  ex_units_steps: number;
  input_idx: number;
  plutus_data: PlutusDataField;
};
