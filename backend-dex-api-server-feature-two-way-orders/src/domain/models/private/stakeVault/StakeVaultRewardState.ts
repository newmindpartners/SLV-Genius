import * as Public from '~/domain/models/public';

export type StakeVaultRewardState = {
  lockDuration: Public.StakeVaultLockDuration;
  lockApy: number | null;
  nftsApy: number | null;
  revenueAmplifier: number | null;
  totalStakeVaultApy: number | null;
};
