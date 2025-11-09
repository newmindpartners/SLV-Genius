import * as Seed from '~/seed/types';
import {stakingProject} from '../staking-project';

const lockOptionMonths1: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '54e98ebf-10cc-44da-abf2-a7b846887e6d',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_1',
  apy: 3.5,
};

const lockOptionMonths3: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '1892cac1-48de-4416-98ee-ec60fc943349',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_3',
  apy: 4,
};

const lockOptionMonths6: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '7de0aeff-9ea3-4db9-a840-618417a2febb',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_6',
  apy: 4.75,
};

export const stakingProjectLockOptions: Seed.StakingProjectLockOption[] = [
  lockOptionMonths1,
  lockOptionMonths3,
  lockOptionMonths6,
];
