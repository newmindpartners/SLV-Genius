import * as Seed from '~/seed/types';
import {project as gensPreprodProject} from '~/seed/data/projects/gens/projectGroup/preprod/project';

const gensStakingProject: Seed.StakingProject = {
  stakingProjectId: '167c70ed-7a32-4222-b866-d806b55dbe4a',
  projectId: gensPreprodProject.projectId,
  signingServerUrl: 'localhost:9001',
  stakeVaultType: 'REVENUE_AMPLIFYING',
};

export const stakingProject = gensStakingProject;
