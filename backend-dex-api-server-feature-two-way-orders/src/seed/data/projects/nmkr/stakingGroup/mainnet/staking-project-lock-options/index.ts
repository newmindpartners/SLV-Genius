import * as Seed from '~/seed/types';
import {stakingProject} from '../staking-project';

const lockOptionMonths6: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '867dfe9c-a40c-47a2-bc7b-61e91cfc8082',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_6',
  apy: 5,
};

const lockOptionMonths9: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '3ecf20aa-5658-4107-bf63-441796fe7210',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_9',
  apy: 7,
};

const lockOptionMonths12: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '602a35ce-eed2-43bb-8532-72b9c7f07016',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_12',
  apy: 10,
};

export const stakingProjectLockOptions: Seed.StakingProjectLockOption[] = [
  lockOptionMonths6,
  lockOptionMonths9,
  lockOptionMonths12,
];
