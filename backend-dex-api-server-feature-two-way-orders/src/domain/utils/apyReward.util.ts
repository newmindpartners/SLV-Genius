/**
 * A multiplication factor of 1,000,000 allows our calculations to utilise 6 decimals.
 * If we lower it, we will lose precision for 6 digit rewards.
 * We could increase it to achieve higher precision for rewards above 6 digits.
 */
const MULT_FACTOR = 1000000;
const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

/**
 * `principal` is an indivisible amount
 * `apyRate` is a percentage 0 is 0%, 1 is 100%, 1.5 is 150% etc.
 * `timeInMs` is the time passed that is eligible for reward calculation.
 * The function returns an indivisible amount based on the `principal`.
 */
export function calculateStakeVaultReward(
  principal: bigint,
  apyRate: number,
  timeInMs: number
): bigint {
  if (timeInMs < 0 || apyRate < 0 || principal < 0) return BigInt(0);

  const daysPassed = timeInMs / MILLISECONDS_IN_DAY;
  const rewardMultiplier = Math.round(
    Math.pow(1 + apyRate, daysPassed / 365) * MULT_FACTOR * MULT_FACTOR
  );

  const multipliedPrincipalWithReward = principal * BigInt(rewardMultiplier);
  const multipliedPrincipal = principal * BigInt(MULT_FACTOR);

  const totalReward =
    (multipliedPrincipalWithReward / BigInt(MULT_FACTOR) -
      multipliedPrincipal) /
    BigInt(MULT_FACTOR);

  return BigInt(totalReward);
}
