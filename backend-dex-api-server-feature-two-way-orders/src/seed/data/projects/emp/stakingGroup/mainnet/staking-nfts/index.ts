import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';

const foundingCommunityTeam: Seed.StakingNft = {
  type: stakingNftTypes.EMP.FOUNDING_COMMUNITY,
  subType: stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.TEAM,
  stackableWith: [],

  apyBoost: 0.5,

  name: 'Team',
  imageUrl: '/cdn/images/projects/EMP/nfts/FOUNDING_COMMUNITY/TEAM.png',
};

const foundingCommunityCommunity: Seed.StakingNft = {
  type: stakingNftTypes.EMP.FOUNDING_COMMUNITY,
  subType: stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.COMMUNITY,
  stackableWith: [],

  apyBoost: 0.5,

  name: 'Community',
  imageUrl: '/cdn/images/projects/EMP/nfts/FOUNDING_COMMUNITY/COMMUNITY.png',
};

const foundingCommunityProjectCatalyst: Seed.StakingNft = {
  type: stakingNftTypes.EMP.FOUNDING_COMMUNITY,
  subType: stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.PROJECT_CATALYST,
  stackableWith: [],

  apyBoost: 0.5,

  name: 'Project Catalyst',
  imageUrl:
    '/cdn/images/projects/EMP/nfts/FOUNDING_COMMUNITY/PROJECT_CATALYST.png',
};

const foundingCommunityPremium: Seed.StakingNft = {
  type: stakingNftTypes.EMP.FOUNDING_COMMUNITY,
  subType: stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.PREMIUM,
  stackableWith: [],

  apyBoost: 1.0,

  name: 'Premium',
  imageUrl: '/cdn/images/projects/EMP/nfts/FOUNDING_COMMUNITY/PREMIUM.png',
};

export const stakingNfts = [
  foundingCommunityTeam,
  foundingCommunityCommunity,
  foundingCommunityProjectCatalyst,
  foundingCommunityPremium,
];
