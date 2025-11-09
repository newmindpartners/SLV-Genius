import {isArray} from 'lodash';

type Collection = unknown[] | unknown;

// https://lodash.com/docs/4.17.15#mergeWith
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Not all code paths return a value
export function mergeArrays(objValue: Collection, srcValue: Collection) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
