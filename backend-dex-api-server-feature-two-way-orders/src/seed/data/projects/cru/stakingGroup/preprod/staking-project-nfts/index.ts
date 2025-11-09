import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';
import {stakingProject} from '../staking-project';

import {stakingNfts} from '../staking-nfts';

const stakingProjectNftIdMap: {[type: string]: {[subType: string]: string}} = {
  [stakingNftTypes.CRU.BOOSTER]: {
    [stakingNftSubTypes.CRU.BOOSTER.SUPER]:
      '33e523ba-858e-4bfd-bee9-cf91f84ea30a',
    [stakingNftSubTypes.CRU.BOOSTER.MEGA]:
      'cd3fd4ff-b274-4295-bb23-9235c4ce2239',
    [stakingNftSubTypes.CRU.BOOSTER.ULTRA]:
      '8ad5eaba-8da0-48b2-824b-f02193582d33',
  },
  [stakingNftTypes.CRU.ENHANCER]: {
    [stakingNftSubTypes.CRU.ENHANCER.PRIMARY]:
      '1eb08084-0710-4c51-bca9-16cb14d45f32',
  },
};

const getStakingProjectNftId = (type: string, subType: string) => {
  const stakingProjectNftId = stakingProjectNftIdMap[type][subType];

  if (stakingProjectNftId) {
    return stakingProjectNftId;
  } else {
    throw new Error(
      'Provisioning CRU stakingGroup preprod StakingProjectNft: subType not accounted for'
    );
  }
};

export const stakingProjectNfts: Seed.StakingProjectNft[] = stakingNfts.map(
  ({type, subType}) => ({
    stakingProjectId: stakingProject.stakingProjectId,
    stakingProjectNftId: getStakingProjectNftId(type, subType),

    stakingNftType: type,
    stakingNftSubType: subType,
  })
);
