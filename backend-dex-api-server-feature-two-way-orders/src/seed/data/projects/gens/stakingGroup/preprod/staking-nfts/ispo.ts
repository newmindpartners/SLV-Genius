import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';

const stakingNftIspoDiamondHands: Seed.StakingNft = {
  type: stakingNftTypes.GENS.ISPO,
  subType: stakingNftSubTypes.GENS.ISPO.DIAMOND_HANDS,
  stackableWith: [stakingNftTypes.GENS.GENIUS, stakingNftTypes.GENS.MASCOT],

  apyBoost: null,

  name: 'Diamond hands',
  imageUrl: '/cdn/nft/ispo-nfts/diamond-hands.png',
};

const stakingNftIspoApe: Seed.StakingNft = {
  type: stakingNftTypes.GENS.ISPO,
  subType: stakingNftSubTypes.GENS.ISPO.APE,
  stackableWith: [stakingNftTypes.GENS.GENIUS, stakingNftTypes.GENS.MASCOT],

  apyBoost: null,

  name: 'Ape',
  imageUrl: '/cdn/nft/ispo-nfts/ape.png',
};

const stakingNftIspoFomo: Seed.StakingNft = {
  type: stakingNftTypes.GENS.ISPO,
  subType: stakingNftSubTypes.GENS.ISPO.FOMO,
  stackableWith: [stakingNftTypes.GENS.GENIUS, stakingNftTypes.GENS.MASCOT],

  apyBoost: null,

  name: 'FOMO',
  imageUrl: '/cdn/nft/ispo-nfts/fomo.png',
};

const stakingNftIspoHodler: Seed.StakingNft = {
  type: stakingNftTypes.GENS.ISPO,
  subType: stakingNftSubTypes.GENS.ISPO.HODLER,
  stackableWith: [stakingNftTypes.GENS.GENIUS, stakingNftTypes.GENS.MASCOT],

  apyBoost: null,

  name: 'HODLer',
  imageUrl: '/cdn/nft/ispo-nfts/hodler.png',
};

const stakingNftIspoShark: Seed.StakingNft = {
  type: stakingNftTypes.GENS.ISPO,
  subType: stakingNftSubTypes.GENS.ISPO.SHARK,
  stackableWith: [stakingNftTypes.GENS.GENIUS, stakingNftTypes.GENS.MASCOT],

  apyBoost: null,

  name: 'Shark',
  imageUrl: '/cdn/nft/ispo-nfts/shark.png',
};

const stakingNftIspoLateFan: Seed.StakingNft = {
  type: stakingNftTypes.GENS.ISPO,
  subType: stakingNftSubTypes.GENS.ISPO.LATE_FAN,
  stackableWith: [stakingNftTypes.GENS.GENIUS, stakingNftTypes.GENS.MASCOT],

  apyBoost: null,

  name: 'Late Fan',
  imageUrl: '/cdn/nft/ispo-nfts/late-fan.png',
};

const stakingNftIspoDegen: Seed.StakingNft = {
  type: stakingNftTypes.GENS.ISPO,
  subType: stakingNftSubTypes.GENS.ISPO.DEGEN,
  stackableWith: [stakingNftTypes.GENS.GENIUS, stakingNftTypes.GENS.MASCOT],

  apyBoost: null,

  name: 'Degen',
  imageUrl: '/cdn/nft/ispo-nfts/degen.png',
};

export const stakingNfts = [
  stakingNftIspoDiamondHands,
  stakingNftIspoApe,
  stakingNftIspoFomo,
  stakingNftIspoHodler,
  stakingNftIspoShark,
  stakingNftIspoLateFan,
  stakingNftIspoDegen,
];
