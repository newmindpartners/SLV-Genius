import {injectable, singleton} from 'tsyringe';

import {Prisma} from '@prisma/client';
import * as Private from '~/domain/models/private';

import {AssetRepository} from '~/domain/repositories';

import {ErrorCode} from '~/domain/errors/domain.error';

import {assetId} from '~/domain/utils/asset.util';

const ADA_ASSET_ID = assetId('', '');

@singleton()
@injectable()
export class AssetRepositoryPrisma implements AssetRepository {
  async getAdaAsset(prisma: Prisma.TransactionClient): Promise<Private.Asset> {
    return this.getAssetByAssetId(prisma, ADA_ASSET_ID);
  }

  async getAssetByAssetId(
    prisma: Prisma.TransactionClient,
    assetId: string
  ): Promise<Private.Asset> {
    const savedAsset = await prisma.asset.findFirst({
      where: {assetId},
    });

    if (savedAsset) {
      return savedAsset;
    } else {
      throw new Error(ErrorCode.ASSET_NOT_FOUND);
    }
  }

  async getAssetOrNullByAssetId(
    prisma: Prisma.TransactionClient,
    assetId: string
  ): Promise<Private.Asset | null> {
    return prisma.asset.findFirst({
      where: {assetId},
    });
  }

  async getAssetsByAssetIds(
    prisma: Prisma.TransactionClient,
    assetIds: string[]
  ): Promise<Private.Asset[]> {
    return await prisma.asset.findMany({
      where: {assetId: {in: assetIds}},
    });
  }

  async getAssetsMapByAssetIds(
    prisma: Prisma.TransactionClient,
    assetIds: string[]
  ): Promise<Private.AssetsMap> {
    return Private.toAssetsMap(
      await this.getAssetsByAssetIds(prisma, assetIds)
    );
  }

  async getAssetsByAssetPairIds(
    prisma: Prisma.TransactionClient,
    baseAssetId: string,
    quoteAssetId: string
  ): Promise<Private.AssetPair> {
    const [baseAsset, quoteAsset] = await Promise.all([
      prisma.asset.findFirst({where: {assetId: baseAssetId}}),
      prisma.asset.findFirst({where: {assetId: quoteAssetId}}),
    ]);

    if (!baseAsset || !quoteAsset) {
      throw new Error(ErrorCode.ASSET_NOT_FOUND);
    }

    return {baseAsset, quoteAsset};
  }

  async getStakingAssetVesting(
    prisma: Prisma.TransactionClient,
    assetId: string,
    walletStakeKeyHash: string
  ): Promise<bigint | null> {
    const stakingAssetVesting = await prisma.stakingAssetVesting.findFirst({
      where: {assetId, walletStakeKeyHash},
    });

    return stakingAssetVesting ? stakingAssetVesting.assetAmount : null;
  }
}
