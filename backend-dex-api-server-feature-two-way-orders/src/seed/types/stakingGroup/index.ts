import * as Seed from '..';

export type StakingGroupExports = {
  stakingNftMintingDatas?: Seed.StakingNftMintingData[];
  stakingNfts?: Seed.StakingNft[];
  stakingProject: Seed.StakingProject;
  stakingProjectNfts?: Seed.StakingProjectNft[];
  stakingProjectLockOptions: Seed.StakingProjectLockOption[];
};

export const isStakingGroupExports = (
  fileImport: unknown
): fileImport is StakingGroupExports => {
  if (typeof fileImport === 'object' && fileImport !== null) {
    const requiredKeys = [
      'stakingProject',
      'stakingProjectLockOptions',
    ] as const;
    return requiredKeys.every(key => key in fileImport);
  }
  return false;
};
