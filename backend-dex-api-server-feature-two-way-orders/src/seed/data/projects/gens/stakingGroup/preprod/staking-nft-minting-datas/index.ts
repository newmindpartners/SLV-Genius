import * as Prisma from '@prisma/client';
import {getIspoMintingData} from './ispo';
import {getGeniusMintingData} from './genius';

const getStakingNftMintingData =
  (): Prisma.Prisma.StakingNftMintingDataUncheckedCreateInput[] => {
    const ispoMintingData = getIspoMintingData();
    const geniusMintingData = getGeniusMintingData();

    return [...ispoMintingData, ...geniusMintingData];
  };

export const stakingNftMintingDatas = getStakingNftMintingData();
