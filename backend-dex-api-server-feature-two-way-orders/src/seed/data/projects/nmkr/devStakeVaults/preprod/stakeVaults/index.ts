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
    lockDuration: StakeVaultLockDuration.MONTHS_6,
    lockApy: 5,
  },
  {
    stakeVaultId: '74a904d2-d3a6-4a9c-8cfd-e93d9a8b4974',
    stakingProjectId: stakingProject.stakingProjectId,
    userId: devUser.userId,
    type: 'FIXED_APY',
    startedAt: now(),
    unlocksAt: new Date('2024-02-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_9,
    lockApy: 7,
  },
  {
    stakeVaultId: '21bb950c-9e95-41b5-b9e5-b443b3cb152d',
    stakingProjectId: stakingProject.stakingProjectId,
    userId: devUser.userId,
    type: 'FIXED_APY',
    startedAt: now(),
    unlocksAt: new Date('2024-03-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_12,
    lockApy: 10,
  },
];
