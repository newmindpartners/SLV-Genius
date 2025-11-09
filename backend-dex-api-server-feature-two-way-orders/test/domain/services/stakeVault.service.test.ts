import 'reflect-metadata';

import {container} from 'tsyringe';

import {
  StakeVaultService,
  StakeVaultServiceImplementation,
} from '~/domain/services';
import {now} from '~/domain/utils/date.util';
import {ConfigServiceNode} from '~/implementation/node/config.service';
import * as Private from '~/domain/models/private';

beforeAll(() => {
  container.register('StakeVaultService', StakeVaultServiceImplementation);
  container.register('ConfigService', ConfigServiceNode);
});

test('That getLockedUntilDate function works as expected', () => {
  const stakeVaultService =
    container.resolve<StakeVaultService>('StakeVaultService');

  const DAY_IN_MILLISECONDS = 86400000;

  /**
   * Test that 1 months lock period is working
   */
  const startMonths1 = now();
  const months1InDays = 31;
  const months1InMs = months1InDays * DAY_IN_MILLISECONDS;

  const actualMonths1 = stakeVaultService.getRegularLockedUntilDate(
    startMonths1,
    'MONTHS_1'
  );

  startMonths1.setTime(startMonths1.getTime() + months1InMs);

  const expectedMonths1 = startMonths1;

  expect(expectedMonths1.toISOString()).toBe(actualMonths1.toISOString());
  /**
   * Test that 3 months lock period is working
   */
  const startMonths3 = now();
  const months3InDays = 30 * 1 + 31 * 2;
  const months3InMs = months3InDays * DAY_IN_MILLISECONDS;

  const actualMonths3 = stakeVaultService.getRegularLockedUntilDate(
    startMonths3,
    'MONTHS_3'
  );

  startMonths3.setTime(startMonths3.getTime() + months3InMs);

  const expectedMonths3 = startMonths3;

  expect(expectedMonths3.toISOString()).toBe(actualMonths3.toISOString());
  /**
   * Test that 6 months lock period is working
   */
  const startMonths6 = now();
  const months6InDays = 30 * 3 + 31 * 3;
  const months6InMs = months6InDays * DAY_IN_MILLISECONDS;

  const actualMonths6 = stakeVaultService.getRegularLockedUntilDate(
    startMonths6,
    'MONTHS_6'
  );

  startMonths6.setTime(startMonths6.getTime() + months6InMs);

  const expectedMonths6 = startMonths6;

  expect(expectedMonths6.toISOString()).toBe(actualMonths6.toISOString());
  /**
   * Test that 9 months lock period is working
   */
  const startMonths9 = now();
  const months9InDays = 30 * 4 + 31 * 5;
  const months9InMs = months9InDays * DAY_IN_MILLISECONDS;

  const actualMonths9 = stakeVaultService.getRegularLockedUntilDate(
    startMonths9,
    'MONTHS_9'
  );

  startMonths9.setTime(startMonths9.getTime() + months9InMs);

  const expectedMonths9 = startMonths9;

  expect(expectedMonths9.toISOString()).toBe(actualMonths9.toISOString());
  /**
   * Test that 12 months lock period is working
   */
  const startMonths12 = now();
  const months12InDays = 365;
  const months12InMs = months12InDays * DAY_IN_MILLISECONDS;

  const actualMonths12 = stakeVaultService.getRegularLockedUntilDate(
    startMonths12,
    'MONTHS_12'
  );

  startMonths12.setTime(startMonths12.getTime() + months12InMs);

  const expectedMonths12 = startMonths12;

  expect(expectedMonths12.toISOString()).toBe(actualMonths12.toISOString());
});

test('That getTotalRewardForLockDuration function works as expected', () => {
  const stakeVaultService =
    container.resolve<StakeVaultService>('StakeVaultService');

  const stakedAssetAmount = BigInt(1) * BigInt(1_000_000);
  const stakeVaultApy = 15;

  const MONTHS_1: Private.StakeVaultLockDuration = 'MONTHS_1';
  const MONTHS_3: Private.StakeVaultLockDuration = 'MONTHS_3';
  const MONTHS_6: Private.StakeVaultLockDuration = 'MONTHS_6';
  const MONTHS_9: Private.StakeVaultLockDuration = 'MONTHS_9';
  const MONTHS_12: Private.StakeVaultLockDuration = 'MONTHS_12';

  const totalRewards1Months = stakeVaultService.getTotalRewardForLockDuration(
    MONTHS_1,
    stakedAssetAmount,
    stakeVaultApy
  );

  const totalRewards3Months = stakeVaultService.getTotalRewardForLockDuration(
    MONTHS_3,
    stakedAssetAmount,
    stakeVaultApy
  );

  const totalRewards6Months = stakeVaultService.getTotalRewardForLockDuration(
    MONTHS_6,
    stakedAssetAmount,
    stakeVaultApy
  );

  const totalRewards9Months = stakeVaultService.getTotalRewardForLockDuration(
    MONTHS_9,
    stakedAssetAmount,
    stakeVaultApy
  );

  const totalRewards12Months = stakeVaultService.getTotalRewardForLockDuration(
    MONTHS_12,
    stakedAssetAmount,
    stakeVaultApy
  );

  expect(totalRewards1Months.toString()).toEqual((11_940).toString());
  expect(totalRewards3Months.toString()).toEqual((35_855).toString());
  expect(totalRewards6Months.toString()).toEqual((72_585).toString());
  expect(totalRewards9Months.toString()).toEqual((111_043).toString());
  expect(totalRewards12Months.toString()).toEqual((150_000).toString());
});
