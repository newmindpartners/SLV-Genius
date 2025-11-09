import * as Seed from '~/seed/types';
import {stakingProject} from '../staking-project';

const lockOptionMonths6: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: 'fa7a12f0-3219-45b6-b793-9ac70d1c5ef0',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_6',
  apy: 10,
};

const lockOptionMonths12: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '230166c8-a7a0-442e-8f9b-4b08fff9ed9e',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_12',
  apy: 18,
};

export const stakingProjectLockOptions: Seed.StakingProjectLockOption[] = [
  lockOptionMonths6,
  lockOptionMonths12,
];
