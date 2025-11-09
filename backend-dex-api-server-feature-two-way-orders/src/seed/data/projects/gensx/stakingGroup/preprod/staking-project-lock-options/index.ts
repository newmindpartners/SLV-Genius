import * as Seed from '~/seed/types';
import {stakingProject} from '../staking-project';

const lockOptionMonths6: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '900de870-9e6b-49ea-86cb-9fcfeeaddd49',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_6',
  apy: 5,
};

const lockOptionMonths9: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: 'bf5f8a15-8ca0-4168-b45b-72099164ab9f',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_9',
  apy: 7,
};

const lockOptionMonths12: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '2417f4d7-de5f-42a1-bee6-6c16ea533cdb',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_12',
  apy: 11,
};

export const stakingProjectLockOptions: Seed.StakingProjectLockOption[] = [
  lockOptionMonths6,
  lockOptionMonths9,
  lockOptionMonths12,
];
