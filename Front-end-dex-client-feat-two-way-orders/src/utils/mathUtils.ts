import Big, { RoundingMode } from 'big.js';
import { flow, reduce } from 'lodash';

export type NumericInput = string | number;

export const trimTrailingZeros = (number: string) => number.replace(/\.?0+$/, '');

export const trimLeadingZeros = (number: string) => number.replace(/^0+/, '');

export const roundNumber = (number: number, precision: number) =>
  number.toFixed(precision);

// Rounds a string representation of a number to a specific precision.
export const round = (num: string, precision: number) =>
  new Big(num).toFixed(precision).toString();

// Rounds a string representation of a number to a specific precision using bigjs rounding mode
export const roundBigjs = (num: string, precision: number, roundOption: RoundingMode) =>
  new Big(num).round(precision, roundOption).toString();

// Formats a number to a string with a maximum of 20 fraction digits.
export const formatNumber = (number: string): string =>
  number === ''
    ? ''
    : new Intl.NumberFormat(undefined, { maximumFractionDigits: 20 }).format(
        parseFloat(number),
      );

// Converts an indivisible value to a unit value based on the specified precision.
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

// Converts a unit value to an indivisible value based on the specified precision.
export const unitToIndivisible = (unitValue: string, precision: number): string => {
  if (unitValue === '') return '';
  const unitMultiplier = calcUnitMultiplier(precision);
  const bigUnitValue = new Big(unitValue);
  const indivisibleValue = bigUnitValue.times(unitMultiplier);
  return indivisibleValue.toString();
};

// Calculates a multiplier based on the given precision.
export const calcUnitMultiplier = (precision: number) =>
  Big(10).pow(precision).toNumber();

// Returns a formatted unit number based on the given precision.
export const getUnitNumberFormatter = (precision: number) => (indivisibleValue: string) =>
  flow(indivisibleToUnit, formatNumber)(indivisibleValue, precision);

export const times = (valueOne: NumericInput, valueTwo: NumericInput) => {
  const bigOne = new Big(valueOne);
  return bigOne.times(valueTwo).toString();
};

export const div = (valueOne: NumericInput, valueTwo: NumericInput) => {
  const bigOne = new Big(valueOne);
  const bigTwo = new Big(valueTwo);

  const result = bigTwo.eq(0) ? 0 : bigOne.div(valueTwo);

  return result.toString();
};

export const plus = (valueOne: NumericInput, ...otherValues: NumericInput[]) =>
  reduce(
    otherValues,
    (result, value) => {
      return result.plus(value);
    },
    new Big(valueOne),
  ).toString();

export const minus = (valueOne: NumericInput, ...otherValues: NumericInput[]) =>
  reduce(
    otherValues,
    (result, value) => {
      return result.minus(value);
    },
    new Big(valueOne),
  ).toString();

export const stringToNumber = (value: string): number => {
  try {
    const bigValue = new Big(value);
    return bigValue.toNumber();
  } catch (error) {
    console.warn(`Error converting string to number: ${value}`);
    return 0;
  }
};

// Calculates the percentage of the numerator with respect to the denominator.
export const percent = (numerator: NumericInput, denominator: NumericInput) => {
  return stringToNumber(times(div(numerator, denominator), 100));
};

// Compares two numeric values.
export const compare = (valueOne: NumericInput, valueTwo: NumericInput): number => {
  const bigOne = new Big(valueOne);
  return bigOne.cmp(valueTwo);
};

// Checks if two NumericInputs are equal.
export const isEqual = (valueOne: NumericInput, valueTwo: NumericInput): boolean => {
  return compare(valueOne, valueTwo) === 0;
};

// Checks if the first NumericInput is less than the second one.
export const isLess = (valueOne: NumericInput, valueTwo: NumericInput): boolean => {
  return compare(valueOne, valueTwo) < 0;
};

// Checks if the first NumericInput is less or equal than the second one.
export const isLessOrEqual = (
  valueOne: NumericInput,
  valueTwo: NumericInput,
): boolean => {
  return compare(valueOne, valueTwo) <= 0;
};

// Checks if the first NumericInput is greater than the second one.
export const isGreater = (valueOne: NumericInput, valueTwo: NumericInput): boolean => {
  return compare(valueOne, valueTwo) > 0;
};

// Checks if the first NumericInput is greater or equal to the second one
export const isGreaterOrEqual = (
  valueOne: NumericInput,
  valueTwo: NumericInput,
): boolean => {
  return compare(valueOne, valueTwo) >= 0;
};

// Checks if value is between a lower and upper bound, inclusive of bound values.
export const isBetweenInclusive = (
  value: NumericInput,
  lowerBound: NumericInput,
  upperBound: NumericInput,
): boolean => {
  return isGreaterOrEqual(value, lowerBound) && isLessOrEqual(value, upperBound);
};

export const isValidBig = (value?: string): boolean => {
  if (!value) return false;

  try {
    new Big(value);
    return true;
  } catch (e) {
    return false;
  }
};
