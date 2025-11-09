import * as Seed from '~/seed/types';
import {now} from '~/domain/utils/date.util';
import {project as cruPreprodProject} from '~/seed/data/projects/cru/projectGroup/preprod/project';

const cruStakingProject: Seed.StakingProject = {
  stakingProjectId: '6986f704-03e6-4465-a551-0f02fc531534',
  projectId: cruPreprodProject.projectId,

  stakeVaultType: 'FIXED_APY',

  created: now(),
  updated: now(),
};

export const stakingProject = cruStakingProject;
