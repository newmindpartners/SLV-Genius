import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';

const stakingNftMascot: Seed.StakingNft = {
  type: stakingNftTypes.GENS.MASCOT,
  subType: stakingNftSubTypes.GENS.MASCOT.MASCOT,
  stackableWith: [stakingNftTypes.GENS.ISPO],

  apyBoost: 3.0,

  name: 'Mascot',
  imageUrl: '/cdn/nft/mascot-nfts/mascot.png',
};

export const stakingNfts = [stakingNftMascot];
