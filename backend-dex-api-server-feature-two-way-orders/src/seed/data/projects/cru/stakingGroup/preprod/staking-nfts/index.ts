import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';
import * as Seed from '~/seed/types';

export const stakingNfts: Seed.StakingNft[] = [
  {
    type: stakingNftTypes.CRU.BOOSTER,
    subType: stakingNftSubTypes.CRU.BOOSTER.SUPER,
    stackableWith: [stakingNftTypes.CRU.ENHANCER],

    apyBoost: 3.0,

    name: 'Super',
    imageUrl: '/cdn/images/projects/CRU/nfts/SUPER.png',
  },
  {
    type: stakingNftTypes.CRU.BOOSTER,
    subType: stakingNftSubTypes.CRU.BOOSTER.MEGA,
    stackableWith: [stakingNftTypes.CRU.ENHANCER],

    apyBoost: 6.0,

    name: 'Mega',
    imageUrl: '/cdn/images/projects/CRU/nfts/MEGA.png',
  },
  {
    type: stakingNftTypes.CRU.BOOSTER,
    subType: stakingNftSubTypes.CRU.BOOSTER.ULTRA,
    stackableWith: [stakingNftTypes.CRU.ENHANCER],

    apyBoost: 9.0,

    name: 'Ultra',
    imageUrl: '/cdn/images/projects/CRU/nfts/ULTRA.png',
  },
  {
    type: stakingNftTypes.CRU.ENHANCER,
    subType: stakingNftSubTypes.CRU.ENHANCER.PRIMARY,
    stackableWith: [stakingNftTypes.CRU.BOOSTER],

    name: 'Enhancer',
    imageUrl: '/cdn/images/projects/CRU/nfts/ENHANCER.png',
  },
];
