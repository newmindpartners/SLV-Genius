import {injectable, singleton} from 'tsyringe';

import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';
import {SmartVaultAssetAggregate} from '../event/smartVaultAsset/types';
import {SmartVaultAggregate} from '../event/smartVault/types';
import {SmartVaultOperationAggregate} from '../event/smartVaultOperation/types';

@singleton()
@injectable()
export class SmartVaultRepository {
  constructor() {}

  async listSmartVaults(
    prisma: Prisma.Prisma.TransactionClient,
    query: Private.SmartVaultListQuery
  ): Promise<Private.SmartVault[]> {
    const walletStakeKeyHash = query.filterByWalletStakeKeyHash;

    const where: Prisma.Prisma.SmartVaultWhereInput = {
      ...(walletStakeKeyHash ? {creatorStakeKeyHash: walletStakeKeyHash} : {}),
    };

    const smartVaults = await prisma.smartVault.findMany({
      where,
      include: {
        smartVaultAsset: true,
        smartVaultOperation: true,
      },
    });

    return smartVaults;
  }

  async getSmartVaultById(
    prisma: Prisma.Prisma.TransactionClient,
    smartVaultId: string
  ): Promise<Private.SmartVault | null> {
    return prisma.smartVault.findFirst({
      where: {
        smartVaultId,
      },
      include: {
        smartVaultAsset: true,
        smartVaultOperation: true,
      },
    });
  }

  async listSmartVaultOperations(
    prisma: Prisma.Prisma.TransactionClient,
    smartVaultId: string,
    query?: Private.SmartVaultListQuery
  ): Promise<Private.SmartVaultOperation[]> {
    const walletStakeKeyHash = query?.filterByWalletStakeKeyHash;

    const where: Prisma.Prisma.SmartVaultOperationWhereInput = {
      smartVaultId,
      ...(walletStakeKeyHash ? {creatorStakeKeyHash: walletStakeKeyHash} : {}),
    };

    const operations = await prisma.smartVaultOperation.findMany({
      where,
    });

    return operations;
  }

  async getSmartVaultByIdOrThrow(
    prisma: Prisma.Prisma.TransactionClient,
    smartVaultId: string
  ): Promise<Private.SmartVault> {
    return prisma.smartVault.findFirstOrThrow({
      where: {
        smartVaultId,
      },
      include: {
        smartVaultAsset: true,
        smartVaultOperation: true,
      },
    });
  }

  async createOrUpdateSmartVaultProjection(
    prisma: Prisma.Prisma.TransactionClient,
    data: SmartVaultAggregate
  ): Promise<Prisma.SmartVault> {
    const createInput: Prisma.Prisma.SmartVaultCreateInput = {
      ...data,
      smartVaultStrategyConfigJson:
        data.smartVaultStrategyConfigJson || undefined,
    };

    return prisma.smartVault.upsert({
      where: {smartVaultId: data.smartVaultId},
      create: createInput,
      update: createInput,
    });
  }

  async createSmartVaultAssetProjection(
    prisma: Prisma.Prisma.TransactionClient,
    data: SmartVaultAssetAggregate
  ): Promise<Prisma.SmartVaultAsset[]> {
    const tasks: Promise<Prisma.SmartVaultAsset>[] = data.smartVaultAssets.map(
      async ({assetId}) => {
        const createOrUpdate = {
          smartVaultId: data.smartVaultId,
          assetId,
        };

        return prisma.smartVaultAsset.upsert({
          where: {
            smartVaultId_assetId: {
              smartVaultId: data.smartVaultId,
              assetId,
            },
          },
          create: createOrUpdate,
          update: createOrUpdate,
        });
      }
    );

    return Promise.all(tasks);
  }

  async createOrUpdateSmartVaultOperationProjection(
    prisma: Prisma.Prisma.TransactionClient,
    aggregate: SmartVaultOperationAggregate
  ): Promise<Prisma.SmartVaultOperation[]> {
    const tasks = aggregate.smartVaultOperations.map(operation => {
      const create: Prisma.Prisma.SmartVaultOperationCreateInput = {
        smartVault: {
          connect: {
            smartVaultId: aggregate.smartVaultId,
          },
        },
        ...operation,
      };

      return prisma.smartVaultOperation.upsert({
        where: {
          transactionHash_assetId_operationType: {
            transactionHash: operation.transactionHash,
            assetId: operation.assetId,
            operationType: operation.operationType,
          },
        },
        create,
        update: create,
      });
    });

    return Promise.all(tasks);
  }

  async getSmartVaultBySmartVaultId(
    prisma: Prisma.Prisma.TransactionClient,
    smartVaultId: string
  ): Promise<Private.SmartVault | null> {
    return prisma.smartVault.findFirst({
      where: {
        smartVaultId,
      },
      include: {
        smartVaultAsset: true,
        smartVaultOperation: true,
      },
    });
  }

  async getSmartVaultByMintAssetId(
    prisma: Prisma.Prisma.TransactionClient,
    mintAssetId: string
  ): Promise<Private.SmartVault | null> {
    return prisma.smartVault.findFirst({
      where: {
        mintAssetId,
      },
      include: {
        smartVaultAsset: true,
        smartVaultOperation: true,
      },
    });
  }

  async getSmartVaultsByMintAssetId(
    prisma: Prisma.Prisma.TransactionClient,
    mintAssetIds: string[]
  ): Promise<Private.SmartVault[]> {
    return prisma.smartVault.findMany({
      where: {
        mintAssetId: {
          in: mintAssetIds,
        },
      },
      include: {
        smartVaultAsset: true,
        smartVaultOperation: true,
      },
    });
  }
}
