import {injectable, singleton} from 'tsyringe';

import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';

import {StakingNftRepository} from '~/domain/repositories';

@singleton()
@injectable()
export class StakingNftRepositoryPrisma implements StakingNftRepository {
  constructor() {}

  async getStakingNftByTypeAndSubType(
    prisma: Prisma.Prisma.TransactionClient,
    type: string,
    subType: string
  ): Promise<Private.StakingNft> {
    const stakingNft = await prisma.stakingNft.findUniqueOrThrow({
      include: {
        stakingNftMintingData: true,
      },
      where: {
        type_subType: {
          type,
          subType,
        },
      },
    });

    return Promise.resolve(stakingNft);
  }

  async getStakingNftMintingDataByTypeAndSubType(
    prisma: Prisma.Prisma.TransactionClient,
    type: string,
    subType: string
  ): Promise<Private.StakingNftMintingData[]> {
    return await prisma.stakingNftMintingData.findMany({
      where: {
        stakingNftType: type,
        stakingNftSubType: subType,
      },
    });
  }

  async getStakingNftMintingDataByAssetIdOrThrow(
    prisma: Prisma.Prisma.TransactionClient,
    assetId: string
  ): Promise<Private.StakingNftMintingData> {
    return await prisma.stakingNftMintingData.findUniqueOrThrow({
      where: {assetId},
    });
  }

  async getStakingNftMintingDataByAssetId(
    prisma: Prisma.Prisma.TransactionClient,
    assetId: string
  ): Promise<Private.StakingNftMintingData | null> {
    return await prisma.stakingNftMintingData.findUnique({
      where: {assetId},
    });
  }

  async getStakingNftsByAssetIds(
    prisma: Prisma.Prisma.TransactionClient,
    assetIds: string[]
  ): Promise<Private.StakingNftWithMintingData[]> {
    const mintingDataWithStakingNft =
      await prisma.stakingNftMintingData.findMany({
        where: {
          assetId: {
            in: assetIds,
          },
        },
        include: {
          stakingNft: true,
        },
      });

    const stakingNfts: Private.StakingNftWithMintingData[] =
      mintingDataWithStakingNft.map(
        ({stakingNft, ...stakingNftMintingData}) => {
          return {
            ...stakingNft,
            stakingNftMintingData,
          };
        }
      );

    return stakingNfts;
  }
}
