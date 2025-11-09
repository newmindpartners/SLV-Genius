import {isUndefined, omitBy} from 'lodash';
import * as loFp from 'lodash/fp';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const optional = (obj: Record<string, any>) => omitBy(obj, isUndefined);

/**
 * In place of lodash `invert` because it does not infer types correctly.
 */
export const invertRecord = <K extends string, V extends string>(
  record: Record<K, V>
): Record<V, K> =>
  Object.entries(record).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [value as V]: key as K,
    }),
    {} as Record<V, K>
  );

export const isSomeEmpty = (object: Record<string, string>) =>
  !loFp.flow(loFp.values, loFp.some(loFp.isEmpty))(object);

// Simple mutative type safe record update
export const update =
  (key: string, updater: (value: unknown) => unknown) =>
  (value: Record<string, unknown>) => {
    Object.defineProperty(value, key, {value: updater(value[key])});
    return value;
  };
