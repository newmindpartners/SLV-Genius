import {map} from 'lodash';
import {
  bigIntOrNull,
  dateOrNull,
  numberOrNull,
} from '~/domain/models/core/orderSwapDatum';

const envelopeUndefined = {};
const envelopeInt = {int: 100};
const envelopeIntValidDate = {int: 1697042556234};
const envelopeIntMax = {int: Number.MAX_SAFE_INTEGER};
const envelopeIntMin = {int: Number.MIN_SAFE_INTEGER};
const envelopeBignint = {bignint: '015e531a0a1c872bad2ce16256fe81ffffffffffff'}; // 1999999999999999999999999999999999999999999999999
const envelopeBiguint = {biguint: '010000000000000000'}; // 18446744073709551616

const testCases = [
  envelopeUndefined,
  envelopeInt,
  envelopeIntMax,
  envelopeIntMin,
  envelopeIntValidDate,
  envelopeBignint,
  envelopeBiguint,
];

test('bigIntOrNull', async () => {
  const result = map(testCases, bigIntOrNull);
  expect(result).toStrictEqual([
    null,
    100n,
    9007199254740991n,
    -9007199254740991n,
    1697042556234n,
    1999999999999999999999999999999999999999999999999n,
    18446744073709551616n,
  ]);
});

test('numberOrNull', async () => {
  const result = map(testCases, numberOrNull);
  expect(result).toStrictEqual([
    null,
    100,
    9007199254740991,
    -9007199254740991,
    1697042556234,
    2e48,
    18446744073709552000, // note loss of precision
  ]);
});

test('dateOrNull', async () => {
  const result = map(testCases, dateOrNull);
  expect(result).toStrictEqual([
    null,
    new Date('1970-01-01T00:00:00.100Z'),
    new Date('+275760-09-13T00:00:00.000Z'),
    new Date('-271821-04-20T00:00:00.000Z'),
    new Date('2023-10-11T16:42:36.234Z'),
    new Date('+275760-09-13T00:00:00.000Z'),
    new Date('+275760-09-13T00:00:00.000Z'),
  ]);
});
