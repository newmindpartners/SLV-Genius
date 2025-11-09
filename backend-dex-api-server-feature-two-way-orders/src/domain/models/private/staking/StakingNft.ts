import * as Prisma from '@prisma/client';

export type StakingNft = Omit<Prisma.StakingNft, 'created' | 'updated'>;

export type StakingNftMintingData =
  Prisma.Prisma.StakingNftMintingDataUncheckedCreateInput;

export type StakingNftWithMintingData = StakingNft & {
  stakingNftMintingData: StakingNftMintingData;
};

export type StakeVaultEventNft =
  Prisma.Prisma.StakeVaultEventNftUncheckedCreateInput;

export const stakingNftTypes = {
  GENS: {
    ISPO: 'ISPO',
    GENIUS: 'GENIUS',
    MASCOT: 'MASCOT',
  },
  NMKR: {
    SEAPLANE: 'SEAPLANE',
  },
  CRU: {
    BOOSTER: 'BOOSTER',
    ENHANCER: 'ENHANCER',
  },
  EMP: {
    FOUNDING_COMMUNITY: 'FOUNDING_COMMUNITY',
  },
  GENSX: {
    VESTA: 'VESTA',
    COMET: 'COMET',
    TITAN: 'TITAN',
    GALAXY: 'GALAXY',
  },
} as const;

export const stakingNftSubTypes = {
  GENS: {
    ISPO: {
      DIAMOND_HANDS: 'DIAMOND_HANDS',
      APE: 'APE',
      FOMO: 'FOMO',
      HODLER: 'HODLER',
      SHARK: 'SHARK',
      LATE_FAN: 'LATE_FAN',
      DEGEN: 'DEGEN',
    },
    GENIUS: {
      COMMON: 'COMMON',
      RARE: 'RARE',
      EPIC: 'EPIC',
      LEGENDARY: 'LEGENDARY',
    },
    MASCOT: {
      MASCOT: 'MASCOT',
    },
  },
  NMKR: {
    SEAPLANE: {
      BRONZE: 'BRONZE',
      SILVER: 'SILVER',
      GOLD: 'GOLD',
    },
  },
  CRU: {
    ENHANCER: {
      PRIMARY: 'PRIMARY',
    },
    BOOSTER: {
      SUPER: 'SUPER',
      MEGA: 'MEGA',
      ULTRA: 'ULTRA',
    },
  },
  EMP: {
    FOUNDING_COMMUNITY: {
      TEAM: 'TEAM',
      COMMUNITY: 'COMMUNITY',
      PROJECT_CATALYST: 'PROJECT_CATALYST',
      PREMIUM: 'PREMIUM',
    },
  },
  GENSX: {
    VESTA: {
      VESTA: 'VESTA',
    },
    COMET: {
      COMET: 'COMET',
    },
    TITAN: {
      TITAN: 'TITAN',
    },
    GALAXY: {
      GALAXY: 'GALAXY',
    },
  },
} as const;
