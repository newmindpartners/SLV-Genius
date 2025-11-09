import {Prisma} from '@prisma/client';
export * from './StakeVaultRewardState';

export type StakeVault = Prisma.StakeVaultGetPayload<{
  include: {
    stakeVaultEvent: true;
  };
}>;

export type StakeVaultWithEvents = Prisma.StakeVaultGetPayload<{
  include: {
    stakeVaultEvent: true;
  };
}>;
