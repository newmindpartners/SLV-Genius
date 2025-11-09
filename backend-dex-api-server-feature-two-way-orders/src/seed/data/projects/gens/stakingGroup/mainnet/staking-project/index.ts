import * as Seed from '~/seed/types';
import {project as gensMainnetProject} from '~/seed/data/projects/gens/projectGroup/mainnet/project';

const gensMainnetStakingProject: Seed.StakingProject = {
  stakingProjectId: '167c70ed-7a32-4222-b866-d806b55dbe4a',
  projectId: gensMainnetProject.projectId,
  signingServerUrl: 'localhost:9001',
  stakeVaultType: 'REVENUE_AMPLIFYING',
};

export const stakingProject = gensMainnetStakingProject;
