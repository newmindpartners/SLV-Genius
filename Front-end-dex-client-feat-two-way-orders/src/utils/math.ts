import Big from 'big.js';
import { flow, gt, reduce } from 'lodash';

type NumericInput = string | number;

export const percent = (numerator: NumericInput, denominator: NumericInput): number => {
  return Number(times(div(numerator, denominator), 100));
};

export const safePercent = (numerator: NumericInput, denominator: NumericInput): number =>
  gt(Number(numerator), 0) && gt(Number(denominator), 0)
    ? percent(numerator, denominator)
    : 0;

export const roundNumber = (number: number, precision: number): string =>
  number.toFixed(precision);

export const formatNumber = (number: string): string =>
  number === ''
    ? ''
    : new Intl.NumberFormat(undefined, { maximumFractionDigits: 20 }).format(
        parseFloat(number),
      );

/**
 * Format number using US style, for example 9,750.335 if precision is set to 3.
 * `minimumFractionDigits` of `0` is used to avoid showing unnecessary decimal points that are zero.
 */
export const formatNumberWithPrecision = (num: number, precision: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(num);
};

export const indivisibleToUnit = (
  indivisibleValue: string,
  precision: number,
): string => {
  if (indivisibleValue === '') return '';
  const unitMultiplier = calcUnitMultiplier(precision);
  const bigIndivisibleValue = new Big(indivisibleValue);
  const unitValue = bigIndivisibleValue.div(unitMultiplier);
  return unitValue.toString();
};

export const unitToIndivisible = (unitValue: string, precision: number): string => {
  if (unitValue === '') return '';
  const unitMultiplier = calcUnitMultiplier(precision);
  const bigUnitValue = new Big(unitValue);
  const indivisibleValue = bigUnitValue.times(unitMultiplier);
  return indivisibleValue.toString();
};

export const calcUnitMultiplier = (precision: number): number =>
  Big(10).pow(precision).toNumber();

export const getUnitNumberFormatter =
  (precision: number) =>
  (indivisibleValue: string): string =>
    flow(indivisibleToUnit, formatNumber)(indivisibleValue, precision);

export const times = (valueOne: NumericInput, valueTwo: NumericInput): string => {
  const bigOne = new Big(valueOne);
  return bigOne.times(valueTwo).toString();
};

export const div = (valueOne: NumericInput, valueTwo: NumericInput): string => {
  const bigOne = new Big(valueOne);
  return bigOne.div(valueTwo).toString();
};

export const plus = (valueOne: NumericInput, ...otherValues: NumericInput[]): string =>
  reduce(
    otherValues,
    (result, value) => {
      return result.plus(value);
    },
    new Big(valueOne),
  ).toString();

export const stringToNumber = (value: string): number => {
  const bigValue = new Big(value);
  return bigValue.toNumber();
};
