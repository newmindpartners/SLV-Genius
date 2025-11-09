import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';

const stakingNftGeniusCommon: Seed.StakingNft = {
  type: stakingNftTypes.GENS.GENIUS,
  subType: stakingNftSubTypes.GENS.GENIUS.COMMON,
  stackableWith: [stakingNftTypes.GENS.ISPO],

  apyBoost: 2.0,

  name: 'Genius NFT Common',
  imageUrl: '/cdn/nft/genius-nfts/common.png',
};

const stakingNftGeniusRare: Seed.StakingNft = {
  type: stakingNftTypes.GENS.GENIUS,
  subType: stakingNftSubTypes.GENS.GENIUS.RARE,
  stackableWith: [stakingNftTypes.GENS.ISPO],

  apyBoost: 3.0,

  name: 'Genius NFT Rare',
  imageUrl: '/cdn/nft/genius-nfts/rare.png',
};

const stakingNftGeniusEpic: Seed.StakingNft = {
  type: stakingNftTypes.GENS.GENIUS,
  subType: stakingNftSubTypes.GENS.GENIUS.EPIC,
  stackableWith: [stakingNftTypes.GENS.ISPO],

  apyBoost: 5.0,

  name: 'Genius NFT Epic',
  imageUrl: '/cdn/nft/genius-nfts/epic.png',
};

const stakingNftGeniusLegendary: Seed.StakingNft = {
  type: stakingNftTypes.GENS.GENIUS,
  subType: stakingNftSubTypes.GENS.GENIUS.LEGENDARY,
  stackableWith: [stakingNftTypes.GENS.ISPO],

  apyBoost: 6.0,

  name: 'Genius NFT Legendary',
  imageUrl: '/cdn/nft/genius-nfts/legendary.png',
};

export const stakingNfts = [
  stakingNftGeniusCommon,
  stakingNftGeniusRare,
  stakingNftGeniusEpic,
  stakingNftGeniusLegendary,
];
