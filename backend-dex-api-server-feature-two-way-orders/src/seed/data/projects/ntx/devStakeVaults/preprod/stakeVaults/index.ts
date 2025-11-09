import * as Seed from '~/seed/types';
import {stakingProject} from '../../../stakingGroup/preprod/staking-project';
import {user as devUser} from '~/seed/data/misc/devUser/user';
import {StakeVaultLockDuration} from '@prisma/client';
import {now} from '~/domain/utils/date.util';

export const stakeVaults: Seed.StakeVault[] = [
  {
    stakeVaultId: '1d4f05d6-283c-4f62-81d4-6749221eeccc',
    stakingProjectId: stakingProject.stakingProjectId,
    userId: devUser.userId,
    type: 'FIXED_APY',
    startedAt: now(),
    unlocksAt: new Date('2024-01-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_3,
    lockApy: 6,
  },
  {
    stakeVaultId: '05f1a96f-676d-44aa-8cc9-3aad8d1f76df',
    stakingProjectId: stakingProject.stakingProjectId,
    userId: devUser.userId,
    type: 'FIXED_APY',
    startedAt: now(),
    unlocksAt: new Date('2024-04-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_3,
    lockApy: 6,
  },
];
