import * as Seed from '~/seed/types';
import {project} from '../../../projectGroup/preprod';

export const stakingProject: Seed.StakingProject = {
  stakingProjectId: '9b7d311a-5c47-4293-ba9d-3ac07d49066e',
  projectId: project.projectId,
  // Set to be 1 millionth of the mainnet configuration for ease of testing
  stakedAssetTotalAmountLimit: 12_000_000,
  signingServerUrl: 'localhost:9003',
  stakeVaultType: 'FIXED_APY',
};
