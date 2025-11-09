import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';
import {stakingProject} from '../staking-project';

import {stakingNfts} from '../staking-nfts';

const stakingProjectNftIdMap: {[type: string]: {[subType: string]: string}} = {
  [stakingNftTypes.NMKR.SEAPLANE]: {
    [stakingNftSubTypes.NMKR.SEAPLANE.BRONZE]:
      '2f81f41c-4570-45fe-86ac-e91fa5e5769d',
    [stakingNftSubTypes.NMKR.SEAPLANE.SILVER]:
      '481814de-4b82-4688-8c96-0d15f438117d',
    [stakingNftSubTypes.NMKR.SEAPLANE.GOLD]:
      'fd0fca8b-d8d6-4d58-9593-f3f5a045323b',
  },
};

const getStakingProjectNftId = (type: string, subType: string) => {
  const stakingProjectNftId = stakingProjectNftIdMap[type][subType];

  if (stakingProjectNftId) {
    return stakingProjectNftId;
  } else {
    throw new Error(
      'Provisioning NMKR stakingGroup preprod StakingProjectNft: subType not accounted for'
    );
  }
};

const getStakingNfts = (stakingProjectId: string): Seed.StakingProjectNft[] =>
  stakingNfts.map(({type, subType}) => ({
    stakingProjectId,
    stakingProjectNftId: getStakingProjectNftId(type, subType),

    stakingNftType: type,
    stakingNftSubType: subType,
  }));

export const stakingProjectNfts: Seed.StakingProjectNft[] = getStakingNfts(
  stakingProject.stakingProjectId
);
