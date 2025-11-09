import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';
import {stakingProject} from '../staking-project';

import {stakingNfts} from '../staking-nfts';

const stakingProjectNftIdMap: {[type: string]: {[subType: string]: string}} = {
  [stakingNftTypes.GENSX.VESTA]: {
    [stakingNftSubTypes.GENSX.VESTA.VESTA]:
      '509c5de5-fceb-4135-b462-a824736ae579',
  },
  [stakingNftTypes.GENSX.COMET]: {
    [stakingNftSubTypes.GENSX.COMET.COMET]:
      '315e6096-ea8d-4576-bc49-92948fafab03',
  },
  [stakingNftTypes.GENSX.TITAN]: {
    [stakingNftSubTypes.GENSX.TITAN.TITAN]:
      '3e4ca066-3ef0-4994-9c67-109c04468c7f',
  },
  [stakingNftTypes.GENSX.GALAXY]: {
    [stakingNftSubTypes.GENSX.GALAXY.GALAXY]:
      'd6fe2e22-51d5-49e8-92d3-236980a8cb8b',
  },
};

const getStakingProjectNftId = (type: string, subType: string) => {
  const stakingProjectNftId = stakingProjectNftIdMap[type][subType];

  if (stakingProjectNftId) {
    return stakingProjectNftId;
  } else {
    throw new Error(
      'Provisioning GENSX stakingGroup preprod StakingProjectNft: subType not accounted for'
    );
  }
};

const getStakingNfts = (stakingProjectId: string): Seed.StakingProjectNft[] =>
  stakingNfts.map(({type, subType}) => ({
    stakingProjectId: stakingProjectId,
    stakingProjectNftId: getStakingProjectNftId(type, subType),

    stakingNftType: type,
    stakingNftSubType: subType,
  }));

export const stakingProjectNfts = getStakingNfts(
  stakingProject.stakingProjectId
);
