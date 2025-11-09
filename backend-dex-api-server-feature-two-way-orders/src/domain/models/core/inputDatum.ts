import {Datum} from './datum';
import {DatumTypes} from './datumType';

import {Hex} from '~/domain/models/cardano';

import * as Core from '~/domain/models/core';
import * as Oura from '~/domain/models/oura';

const InputDatumType = DatumTypes.INPUT_DATUM;

export type InputDatum = Datum & {
  transactionOutputHash: Hex;
  transactionOutputIndex: number;
};

export function makeInputDatum(
  payload: Omit<InputDatum, 'datumType'>
): InputDatum {
  return {
    datumType: InputDatumType,
    ...payload,
  };
}

export function isInputDatum(datum: InputDatum): datum is InputDatum {
  return datum && InputDatumType === datum.datumType;
}

export function findInputDatum(datum: InputDatum[]): InputDatum | null {
  for (const it of datum) {
    if (isInputDatum(it)) {
      return it;
    }
  }
  return null;
}

export function mapInputDatum(it: Oura.PlutusData): Core.InputDatum | null {
  const {datum_hash: datumHash} = it;

  if (
    datumHash &&
    it.plutus_data &&
    it.plutus_data.fields &&
    it.plutus_data.fields.length === 2
  ) {
    let transactionOutputHash: Hex | null = null;
    if (
      it.plutus_data &&
      it.plutus_data.fields &&
      it.plutus_data.fields[0] &&
      it.plutus_data.fields[0].fields &&
      it.plutus_data.fields[0].fields?.length === 1 &&
      it.plutus_data.fields[0].fields[0].bytes
    ) {
      transactionOutputHash = it.plutus_data.fields[0].fields[0].bytes;
    }

    let transactionOutputIndex: number | null = null;
    if (
      it.plutus_data &&
      it.plutus_data.fields &&
      it.plutus_data.fields[1] &&
      it.plutus_data.fields[1].int !== undefined
    ) {
      transactionOutputIndex = it.plutus_data.fields[1].int;
    }

    if (transactionOutputHash && null !== transactionOutputIndex) {
      return makeInputDatum({
        datumHash,
        transactionOutputHash,
        transactionOutputIndex,
      });
    }
  }

  return null;
}
