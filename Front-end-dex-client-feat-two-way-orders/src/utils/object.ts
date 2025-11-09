import { isUndefined, omitBy } from 'lodash';

export const optional = <T>(obj: Record<string, T>) => omitBy(obj, isUndefined);
