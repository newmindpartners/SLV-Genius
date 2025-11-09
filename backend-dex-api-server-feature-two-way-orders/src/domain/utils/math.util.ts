import Big from 'big.js';
import {reduce} from 'lodash';
import Fraction from 'fraction.js';

type NumericInput = number | string;

export const toFixed = (value: NumericInput, fixedValue = 0): NumericInput => {
  const bigValue = new Big(value);
  return bigValue.toFixed(fixedValue);
};

export const times = (valueOne: NumericInput, valueTwo: NumericInput) => {
  const bigOne = new Big(valueOne || 0);
  return bigOne.times(valueTwo || 0).toNumber();
};

export const div = (valueOne: NumericInput, valueTwo: NumericInput) => {
  const bigOne = new Big(valueOne);
  return bigOne.div(valueTwo).toNumber();
};

export const plus = (valueOne: NumericInput, ...otherValues: NumericInput[]) =>
  reduce(
    otherValues,
    (result, value) => {
      return result.plus(value || 0);
    },
    new Big(valueOne || 0)
  ).toNumber();

export const minus = (valueOne: NumericInput, ...otherValues: NumericInput[]) =>
  reduce(
    otherValues,
    (result, value) => {
      return result.minus(value || 0);
    },
    new Big(valueOne || 0)
  ).toNumber();

export const clampBigInt = (num: bigint, min: bigint, max: bigint): bigint => {
  if (num < min) return min;
  else if (num > max) return max;
  else return num;
};

export const minNumeric = (num: bigint | number, min: bigint | number) => {
  if (num < min) return num;
  else return min;
};

export const parseStringNumberToBigInt = (numStr: string): bigint | null => {
  const num = Number(numStr);
  return isNaN(num) ? null : BigInt(num);
};

export const roundUpToInt = (num: NumericInput): string => {
  const bigOne = new Big(num);
  return bigOne.round(0, Big.roundUp).toString();
};

export const extractNumeratorDenominator = (
  numericValue: NumericInput
): {numerator: string; denominator: string} => {
  const bigValue = new Big(numericValue);
  const fraction = new Fraction(bigValue.toNumber());

  return {
    numerator: fraction.n.toString(),
    denominator: fraction.d.toString(),
  };
};
