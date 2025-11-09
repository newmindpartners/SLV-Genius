import * as Seed from '~/seed/types';
import {project} from '../../../projectGroup/mainnet';

export const stakingProject: Seed.StakingProject = {
  stakingProjectId: '5bbf2d9f-e58e-4cb0-8af4-13a8350cc2c5',
  projectId: project.projectId,
  /**
   * NTX all time limit should be 55m tokens.
   * Update April 2024: Increase to 75m tokens.
   * NTX has 6 decimals, hence the 12 zeros.
   */
  stakedAssetTotalAmountLimit: 75_000_000_000_000,
  signingServerUrl: 'localhost:9002',
  stakeVaultType: 'FIXED_APY',
  webEnabled: false,
};
