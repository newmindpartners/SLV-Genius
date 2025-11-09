import * as Seed from '~/seed/types';
import {project} from '../../../projectGroup/preprod';

export const stakingProject: Seed.StakingProject = {
  stakingProjectId: '5bbf2d9f-e58e-4cb0-8af4-13a8350cc2c5',
  projectId: project.projectId,
  // Set to be 1 millionth of the mainnet configuration for ease of testing
  stakedAssetTotalAmountLimit: 75_000_000,
  signingServerUrl: 'localhost:9002',
  stakeVaultType: 'FIXED_APY',
  webEnabled: false,
};
