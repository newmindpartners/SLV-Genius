import * as Seed from '~/seed/types';
import {stakingNftSubTypes, stakingNftTypes} from '~/domain/models/private';
import {stakingProject as gensPreprodStakingProject} from '~/seed/data/projects/gens/stakingGroup/preprod/staking-project';

import {stakingNfts as stakingNftsGenius} from '../staking-nfts/genius';
import {stakingNfts as stakingNftsMascot} from '../staking-nfts/mascot';
import {stakingNfts as stakingNftsIspo} from '../staking-nfts/ispo';

const stakingProjectNftIdMap: {[type: string]: {[subType: string]: string}} = {
  [stakingNftTypes.GENS.GENIUS]: {
    [stakingNftSubTypes.GENS.GENIUS.COMMON]:
      '2218ff97-f13b-440d-8eb9-bfd8558b163c',
    [stakingNftSubTypes.GENS.GENIUS.RARE]:
      '43064e43-677a-4c24-867f-1344ca2bdf20',
    [stakingNftSubTypes.GENS.GENIUS.EPIC]:
      'e94f7c6b-2c4e-4900-9264-a87411081180',
    [stakingNftSubTypes.GENS.GENIUS.LEGENDARY]:
      'bb13ff8a-7293-4db3-9ff5-955da1caaa41',
  },
  [stakingNftTypes.GENS.MASCOT]: {
    [stakingNftSubTypes.GENS.MASCOT.MASCOT]:
      'b9501dba-cecc-4a48-987e-f294c7e629f8',
  },
  [stakingNftTypes.GENS.ISPO]: {
    [stakingNftSubTypes.GENS.ISPO.DIAMOND_HANDS]:
      '67734070-8123-4e24-9895-d4571a8d9708',
    [stakingNftSubTypes.GENS.ISPO.APE]: '62abbbd6-eb01-4831-af7c-b6454876bcc4',
    [stakingNftSubTypes.GENS.ISPO.FOMO]: 'be9fe790-7bed-4696-b6db-22ac31e8a843',
    [stakingNftSubTypes.GENS.ISPO.HODLER]:
      'c405ac5a-c90c-488a-93f4-765fb08cb4fc',
    [stakingNftSubTypes.GENS.ISPO.SHARK]:
      '4787b1c3-047c-4150-a5ab-5842c4fd4c73',
    [stakingNftSubTypes.GENS.ISPO.LATE_FAN]:
      '133fc682-a956-447d-933e-4606da40fffd',
    [stakingNftSubTypes.GENS.ISPO.DEGEN]:
      '182a16e3-483c-488a-81b7-9afa34c01057',
  },
};

const getStakingProjectNftId = (type: string, subType: string) => {
  const stakingProjectNftId = stakingProjectNftIdMap[type][subType];

  if (stakingProjectNftId) {
    return stakingProjectNftId;
  } else {
    throw new Error(
      'Provisioning GENS stakingGroup preprod StakingProjectNft: subType not accounted for'
    );
  }
};

const getGeniusNfts = (stakingProjectId: string): Seed.StakingProjectNft[] =>
  stakingNftsGenius.map(({type, subType}) => ({
    stakingProjectId,
    stakingProjectNftId: getStakingProjectNftId(type, subType),

    stakingNftType: type,
    stakingNftSubType: subType,
  }));

const getMascotNfts = (stakingProjectId: string): Seed.StakingProjectNft[] =>
  stakingNftsMascot.map(({type, subType}) => ({
    stakingProjectId,
    stakingProjectNftId: getStakingProjectNftId(type, subType),

    stakingNftType: type,
    stakingNftSubType: subType,
  }));

const getIspoNfts = (stakingProjectId: string): Seed.StakingProjectNft[] =>
  stakingNftsIspo.map(({type, subType}) => ({
    stakingProjectId: stakingProjectId,
    stakingProjectNftId: getStakingProjectNftId(type, subType),

    stakingNftType: type,
    stakingNftSubType: subType,
  }));

const getStakingProjectNfts = (
  stakingProjectId: string
): Seed.StakingProjectNft[] => [
  ...getGeniusNfts(stakingProjectId),
  ...getMascotNfts(stakingProjectId),
  ...getIspoNfts(stakingProjectId),
];

export const stakingProjectNfts = getStakingProjectNfts(
  gensPreprodStakingProject.stakingProjectId
);
