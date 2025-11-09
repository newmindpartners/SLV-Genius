import {map, reduce} from 'lodash';

import {DatumType} from './datumType';

import {Hex} from '~/domain/models/cardano';

import * as Oura from '~/domain/models/oura';

export type Datum = {
  datumType: DatumType;
  datumHash: Hex;
};

export function mapDatums<T extends Datum>(
  datums: Oura.PlutusData[] | null,
  mappers: ((it: Oura.PlutusData) => T | null)[]
) {
  const initialState: T[] = [];

  const results: T[] = reduce(
    datums,
    (transactionDatum, it) =>
      reduce(
        map(mappers, mapper => mapper(it)),
        (results, it) => (it ? [...results, it] : [...results]),
        transactionDatum
      ),
    initialState
  );

  return results;
}
