import * as Seed from '~/seed/types';
import {stakingProject} from '~/seed/data/projects/gens/stakingGroup/preprod/staking-project';
import {user as devUser} from '~/seed/data/misc/devUser/user';
import {StakeVaultLockDuration} from '@prisma/client';
import {now} from '~/domain/utils/date.util';

export const stakeVaults: Seed.StakeVault[] = [
  {
    stakeVaultId: 'a853d7b9-bd3a-42ab-b41c-1dc4bf7b1aed',
    stakingProjectId: stakingProject.stakingProjectId,
    userId: devUser.userId,
    type: 'FIXED_APY',
    startedAt: now(),
    unlocksAt: new Date('2024-01-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_6,
    lockApy: 9,
  },
  {
    stakeVaultId: 'e8520570-0880-4744-afce-dc1ea9b6c4ae',
    stakingProjectId: stakingProject.stakingProjectId,
    userId: devUser.userId,
    type: 'FIXED_APY',
    startedAt: now(),
    unlocksAt: new Date('2024-02-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_9,
    lockApy: 11,
  },
  {
    stakeVaultId: 'dd638359-db05-474a-b327-8b0cc0322c78',
    stakingProjectId: stakingProject.stakingProjectId,
    userId: devUser.userId,
    type: 'FIXED_APY',
    startedAt: now(),
    unlocksAt: new Date('2024-03-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_12,
    lockApy: 15,
  },
  {
    stakeVaultId: 'd389b537-a05d-4ef6-9de5-0a2e944f7735',
    stakingProjectId: stakingProject.stakingProjectId,
    userId: devUser.userId,
    type: 'FIXED_APY',
    startedAt: now(),
    unlocksAt: new Date('2024-04-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_6,
    lockApy: 9,
  },
  {
    stakeVaultId: 'c6115940-bf56-4eb1-b70e-9a03510241b3',
    stakingProjectId: stakingProject.stakingProjectId,
    userId: devUser.userId,
    type: 'FIXED_APY',
    startedAt: now(),
    unlocksAt: new Date('2024-05-16T00:00:00Z'),
    lockDuration: StakeVaultLockDuration.MONTHS_9,
    lockApy: 11,
  },
];
