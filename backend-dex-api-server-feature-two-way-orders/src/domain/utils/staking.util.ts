import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';

/**
 * This function decides what the actual duration should be for our different
 * "monthly" lock durations.
 *
 * This function is very critical as it's used to decide
 *  - How long a stake vault is locked for
 *    For example, 3 months locks for 92 days
 *  - How much X amounts should count toward yearly reward
 *    For example, 3 months (92 / 365 days = 25.2%)
 *
 * We could've just divided the month by the amount of months in a year (12).
 * The drawback of that approach is that 1 month is then 30.4167 days, which
 * ends up with the stake vault not unlocking on the same time of day.
 *
 * There is no perfect answer, but this approach works just fine so long as we're
 * consistent with always treating X months as the same amount of days.
 */
type Months = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export const calcMonthsToDays = (months: Months): number => {
  if (months === 0) {
    return 0;
  } else if (months >= 1 && months <= 11) {
    return Math.floor(months / 2) * 30 + Math.ceil(months / 2) * 31;
  } else if (months === 12) {
    return 365;
  } else {
    throw new Error('Months input has to be a number between 0 and 12');
  }
};

export const getDaysInLockDuration = (
  lockDuration: Prisma.StakeVaultLockDuration
): number => {
  const lockDurationToMonthsMap: Record<Prisma.StakeVaultLockDuration, Months> =
    {
      FLEX: 0,
      MONTHS_1: 1,
      MONTHS_3: 3,
      MONTHS_6: 6,
      MONTHS_9: 9,
      MONTHS_12: 12,
    };

  const months = lockDurationToMonthsMap[lockDuration];
  return calcMonthsToDays(months);
};

export const getMillisecondsInLockDuration = (
  lockDuration: Prisma.StakeVaultLockDuration
): number => {
  const daysInLockDuration = getDaysInLockDuration(lockDuration);
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsInLockDuration = daysInLockDuration * millisecondsInDay;

  return millisecondsInLockDuration;
};

export const isVestingNft = (stakingNftType: string): boolean => {
  return (
    stakingNftType === Private.stakingNftTypes.GENS.ISPO ||
    stakingNftType === Private.stakingNftTypes.CRU.ENHANCER
  );
};
