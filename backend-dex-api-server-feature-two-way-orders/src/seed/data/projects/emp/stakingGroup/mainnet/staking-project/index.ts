import * as Seed from '~/seed/types';
import {project} from '../../../projectGroup/mainnet';

export const stakingProject: Seed.StakingProject = {
  stakingProjectId: '9b7d311a-5c47-4293-ba9d-3ac07d49066e',
  projectId: project.projectId,
  /**
   * EMP all time limit should be 30m tokens.
   * EMP has 6 decimals, hence the 12 zeros.
   *
   * This limit was initially set to 12m but increased to 30m.
   * See https://github.com/geniusyield/dex-api-server/issues/1916
   */
  stakedAssetTotalAmountLimit: 30_000_000_000_000,
  signingServerUrl: 'localhost:9003',
  stakeVaultType: 'FIXED_APY',
};
