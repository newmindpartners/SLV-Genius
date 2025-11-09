import * as Seed from '~/seed/types';
import {stakingNfts as geniusStakingNfts} from './genius';
import {stakingNfts as mascotStakingNfts} from './mascot';
import {stakingNfts as ispoStakingNfts} from './ispo';

export const stakingNfts: Seed.StakingNft[] = [
  ...geniusStakingNfts,
  ...mascotStakingNfts,
  ...ispoStakingNfts,
];
