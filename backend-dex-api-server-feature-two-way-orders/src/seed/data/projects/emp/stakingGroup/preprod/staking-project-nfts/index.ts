import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';
import {stakingProject} from '../staking-project';

import {stakingNfts} from '../staking-nfts';

const stakingProjectNftIdMap: {[type: string]: {[subType: string]: string}} = {
  [stakingNftTypes.EMP.FOUNDING_COMMUNITY]: {
    [stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.TEAM]:
      '4f1cd05c-06da-4839-ac08-882ceb78355c',
    [stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.COMMUNITY]:
      '6712ddad-11de-4a17-9e8f-c9ade1c2cd02',
    [stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.PROJECT_CATALYST]:
      '9047d519-4d1c-43d6-a20a-ecf0e5c66818',
    [stakingNftSubTypes.EMP.FOUNDING_COMMUNITY.PREMIUM]:
      '33a6c351-de27-4128-a8d7-c13bc79d0d0b',
  },
};

const getStakingProjectNftId = (type: string, subType: string) => {
  const stakingProjectNftId = stakingProjectNftIdMap[type][subType];

  if (stakingProjectNftId) {
    return stakingProjectNftId;
  } else {
    throw new Error(
      'Provisioning EMP stakingGroup mainnet StakingProjectNft: subType not accounted for'
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
