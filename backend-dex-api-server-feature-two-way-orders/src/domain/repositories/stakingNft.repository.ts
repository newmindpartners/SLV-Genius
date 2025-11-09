import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import {
  StakingNft,
  StakingNftMintingData,
  StakingNftWithMintingData,
} from '../models/private';

export interface StakingNftRepository {
  getStakingNftByTypeAndSubType(
    context: TransactionalContext,
    type: string,
    subType: string
  ): Promise<StakingNft>;

  getStakingNftMintingDataByTypeAndSubType(
    context: TransactionalContext,
    type: string,
    subType: string
  ): Promise<StakingNftMintingData[]>;

  getStakingNftMintingDataByAssetId(
    context: TransactionalContext,
    assetId: string
  ): Promise<StakingNftMintingData | null>;

  getStakingNftsByAssetIds(
    context: TransactionalContext,
    assetIds: string[]
  ): Promise<StakingNftWithMintingData[]>;

  getStakingNftMintingDataByAssetIdOrThrow(
    prisma: TransactionalContext,
    assetId: string
  ): Promise<StakingNftMintingData>;
}
