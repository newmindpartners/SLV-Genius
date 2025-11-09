import * as Seed from '~/seed/types';
import {stakingProject} from '../staking-project';

const lockOptionFlex: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: 'c8d954a3-c29a-4644-a639-e80dfe869f42',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'FLEX',
  apy: null,
  revenueAmplifier: 1,
};

const lockOptionMonths6: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: 'a83d5497-96a4-488d-af1b-945b27acdebe',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_6',
  apy: null,
  revenueAmplifier: 5,
};

const lockOptionMonths9: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: 'e6bb57ca-bdc5-40a1-b834-c6a91847484c',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_9',
  apy: null,
  revenueAmplifier: 9,
};

const lockOptionMonths12: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '5413bee5-00aa-4712-8e08-22dde88aa504',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_12',
  apy: null,
  revenueAmplifier: 15,
};

export const stakingProjectLockOptions: Seed.StakingProjectLockOption[] = [
  lockOptionFlex,
  lockOptionMonths6,
  lockOptionMonths9,
  lockOptionMonths12,
];
