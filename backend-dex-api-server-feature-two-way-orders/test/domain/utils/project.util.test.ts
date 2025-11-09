import {times} from '~/domain/utils/math.util';
import {daysFromNow} from '~/domain/utils/date.util';
import {getProjectRoundStatus} from '~/domain/utils/project.util';

const today = daysFromNow(1);
const tomorrow = daysFromNow(2);
const dayAfterTomorrow = daysFromNow(3);

const lovelaceUsdCentsPrice = 0.5;

// lovelace for 1 base asset unit (ie: 1_000_000 GENIES)
const PRICE_LOVELACE = BigInt(850_000);

// USD cents value of lovelace price when price was set
const PRICE_USD = BigInt(times(Number(PRICE_LOVELACE), lovelaceUsdCentsPrice));

test('project round ACTIVE', () => {
  const start = today;
  const finish = tomorrow;
  const notClosed = false;
  const notSoldOut = false;
  const priceUsd = PRICE_USD;
  const priceLovelace = PRICE_LOVELACE;

  const status = getProjectRoundStatus(
    today,
    start,
    finish,
    notClosed,
    notSoldOut,
    priceUsd,
    priceLovelace
  );

  expect(status).toBe('ACTIVE');
});

test('project round UPCOMING', () => {
  const start = tomorrow;
  const finish = dayAfterTomorrow;
  const notSoldOut = false;
  const notClosed = false;
  const priceUsd = PRICE_USD;
  const priceLovelace = PRICE_LOVELACE;

  const status = getProjectRoundStatus(
    today,
    start,
    finish,
    notClosed,
    notSoldOut,
    priceUsd,
    priceLovelace
  );

  expect(status).toBe('UPCOMING');
});

test('project round UPCOMING (because price)', () => {
  const start = tomorrow;
  const finish = dayAfterTomorrow;
  const notSoldOut = false;
  const notClosed = false;
  const priceUsdNull = null;
  const priceLovelaceNull = null;

  const status = getProjectRoundStatus(
    today,
    start,
    finish,
    notClosed,
    notSoldOut,
    priceUsdNull,
    priceLovelaceNull
  );

  expect(status).toBe('UPCOMING');
});

test('project round SOLD OUT', () => {
  const start = today;
  const finish = tomorrow;
  const isSoldOut = true;
  const notClosed = false;
  const priceUsd = PRICE_USD;
  const priceLovelace = PRICE_LOVELACE;

  const status = getProjectRoundStatus(
    today,
    start,
    finish,
    notClosed,
    isSoldOut,
    priceUsd,
    priceLovelace
  );

  expect(status).toBe('CLOSED');
});

test('project round CLOSED', () => {
  const start = today;
  const finish = tomorrow;
  const notSoldOut = false;
  const isClosed = true;
  const priceUsd = PRICE_USD;
  const priceLovelace = PRICE_LOVELACE;

  const status = getProjectRoundStatus(
    today,
    start,
    finish,
    isClosed,
    notSoldOut,
    priceUsd,
    priceLovelace
  );

  expect(status).toBe('CLOSED');
});

test('project round CLOSED end date before NOW', () => {
  const start = today;
  const finish = tomorrow;
  const notSoldOut = false;
  const notClosed = false;
  const priceUsd = PRICE_USD;
  const priceLovelace = PRICE_LOVELACE;

  const status = getProjectRoundStatus(
    dayAfterTomorrow,
    start,
    finish,
    notClosed,
    notSoldOut,
    priceUsd,
    priceLovelace
  );

  expect(status).toBe('CLOSED');
});
