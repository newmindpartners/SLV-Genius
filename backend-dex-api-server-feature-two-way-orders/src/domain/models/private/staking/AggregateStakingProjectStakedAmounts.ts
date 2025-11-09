/**
 * Certain `StakingProject`s have a limit on the total amount of staked assets allowed.
 * Once this limit is reached, no more assets can be staked in that project.
 * This type represents the total amount of staked assets and the limit.
 */
export type AggregateStakingProjectStakedAmounts = {
  stakedAssetTotalAmount: bigint;
  stakedAssetTotalAmountLimit: bigint;
};
