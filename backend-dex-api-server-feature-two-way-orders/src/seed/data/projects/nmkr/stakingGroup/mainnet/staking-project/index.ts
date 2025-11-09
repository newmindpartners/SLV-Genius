import * as Seed from '~/seed/types';
import {project} from '../../../projectGroup/mainnet';

export const stakingProject: Seed.StakingProject = {
  stakingProjectId: 'e6be15de-98a0-4155-af29-f80ed0c95761',
  projectId: project.projectId,
  signingServerUrl: 'localhost:9004',
  stakeVaultType: 'FIXED_APY',
  webEnabled: false,
};
