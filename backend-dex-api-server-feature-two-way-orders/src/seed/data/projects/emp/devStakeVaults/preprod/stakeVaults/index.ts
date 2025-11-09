import * as Seed from '~/seed/types';
import {stakingProject} from '../../../stakingGroup/preprod/staking-project';
import {user as devUser} from '~/seed/data/misc/devUser/user';
import {StakeVaultLockDuration} from '@prisma/client';
import {now} from '~/domain/utils/date.util';

export const stakeVaults: Seed.StakeVault[] = [
  {
    stakeVaultId: '456b923b-8a08-4060-baab-348a6c50baa7',
    stakingProjectId: stakingProject.stakingProjectId,
    type: 'FIXED_APY',
    userId: devUser.userId,
    startedAt: now(),
    unlocksAt: new Date('2024-01-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_3,
    lockApy: 4,
  },
  {
    stakeVaultId: 'aabf7f9a-93ba-4814-9728-c53bab03cd01',
    stakingProjectId: stakingProject.stakingProjectId,
    type: 'FIXED_APY',
    userId: devUser.userId,
    startedAt: now(),
    unlocksAt: new Date('2024-02-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_6,
    lockApy: 4.75,
  },
];
