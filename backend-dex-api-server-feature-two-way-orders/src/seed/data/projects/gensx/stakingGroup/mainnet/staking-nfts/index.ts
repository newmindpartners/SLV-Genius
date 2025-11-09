import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';

const stakingNftVesta: Seed.StakingNft = {
  type: stakingNftTypes.GENSX.VESTA,
  subType: stakingNftSubTypes.GENSX.VESTA.VESTA,
  stackableWith: [stakingNftTypes.GENSX.GALAXY],

  apyBoost: 3.0,

  name: 'Vesta',
  imageUrl: '/cdn/images/projects/GENSX/nfts/VESTA/VESTA.jpg',
};

const stakingNftComet: Seed.StakingNft = {
  type: stakingNftTypes.GENSX.COMET,
  subType: stakingNftSubTypes.GENSX.COMET.COMET,
  stackableWith: [stakingNftTypes.GENSX.GALAXY],

  apyBoost: 6.0,

  name: 'Comet',
  imageUrl: '/cdn/images/projects/GENSX/nfts/COMET/COMET.jpg',
};
const stakingNftTitan: Seed.StakingNft = {
  type: stakingNftTypes.GENSX.TITAN,
  subType: stakingNftSubTypes.GENSX.TITAN.TITAN,
  stackableWith: [stakingNftTypes.GENSX.GALAXY],

  apyBoost: 10.0,

  name: 'Titan',
  imageUrl: '/cdn/images/projects/GENSX/nfts/TITAN/TITAN.jpg',
};
const stakingNftGalaxy: Seed.StakingNft = {
  type: stakingNftTypes.GENSX.GALAXY,
  subType: stakingNftSubTypes.GENSX.GALAXY.GALAXY,
  stackableWith: [
    stakingNftTypes.GENSX.VESTA,
    stakingNftTypes.GENSX.COMET,
    stakingNftTypes.GENSX.TITAN,
  ],

  apyBoost: 10.0,

  name: 'Galaxy',
  imageUrl: '/cdn/images/projects/GENSX/nfts/GALAXY/GALAXY.jpg',
};

export const stakingNfts = [
  stakingNftVesta,
  stakingNftComet,
  stakingNftTitan,
  stakingNftGalaxy,
];
