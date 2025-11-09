import * as Seed from '~/seed/types';
import {project} from '../../../projectGroup/preprod/project';

export const stakingProject: Seed.StakingProject = {
  stakingProjectId: '15cb2f73-57b2-4892-831e-b30904c19c93',
  projectId: project.projectId,
  signingServerUrl: 'localhost:9005',
  stakeVaultType: 'FIXED_APY',
};
