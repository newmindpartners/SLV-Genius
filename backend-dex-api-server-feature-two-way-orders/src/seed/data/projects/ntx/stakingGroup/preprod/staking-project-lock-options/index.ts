import * as Seed from '~/seed/types';
import {stakingProject} from '../staking-project';

const lockOptionMonths3: Seed.StakingProjectLockOption = {
  stakingProjectLockOptionId: '61246d64-dfa4-4c9c-93ec-ef641963fcc4',
  stakingProjectId: stakingProject.stakingProjectId,
  lockDuration: 'MONTHS_3',
  apy: 6,
};

export const stakingProjectLockOptions: Seed.StakingProjectLockOption[] = [
  lockOptionMonths3,
];
