import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';

const seaplaneNftBronze: Seed.StakingNft = {
  type: stakingNftTypes.NMKR.SEAPLANE,
  subType: stakingNftSubTypes.NMKR.SEAPLANE.BRONZE,
  stackableWith: [],

  apyBoost: 1.0,

  name: 'Bronze',
  imageUrl: '/cdn/images/projects/NMKR/nfts/BRONZE.png',
};

const seaplaneNftSilver: Seed.StakingNft = {
  type: stakingNftTypes.NMKR.SEAPLANE,
  subType: stakingNftSubTypes.NMKR.SEAPLANE.SILVER,
  stackableWith: [],

  apyBoost: 2.0,

  name: 'Silver',
  imageUrl: '/cdn/images/projects/NMKR/nfts/SILVER.png',
};

const seaplaneNftGold: Seed.StakingNft = {
  type: stakingNftTypes.NMKR.SEAPLANE,
  subType: stakingNftSubTypes.NMKR.SEAPLANE.GOLD,
  stackableWith: [],

  apyBoost: 3.0,

  name: 'Gold',
  imageUrl: '/cdn/images/projects/NMKR/nfts/GOLD.png',
};

export const stakingNfts = [
  seaplaneNftBronze,
  seaplaneNftSilver,
  seaplaneNftGold,
];
