import * as Prisma from '@prisma/client';
import * as Public from '~/domain/models/public';

/**
 * Smart Vault models
 */
export type SmartVault = Prisma.Prisma.SmartVaultGetPayload<{
  include: {
    smartVaultAsset: true;
    smartVaultOperation: true;
  };
}>;

export const SmartVaultStatus = Prisma.SmartVaultStatus;

export type SmartVaultReference = Pick<SmartVault, 'smartVaultId'>;

export type SmartVaultQuery = {
  smartVaultId: NonNullable<Parameters<typeof Public.getSmartVault>[0]>;
};

export type SmartVaultListQuery = NonNullable<
  Parameters<typeof Public.listSmartVaults>[0]
>;

export type SmartVaultOperationListQuery = NonNullable<
  Parameters<typeof Public.listSmartVaultOperations>[1]
>;

/**
 * Smart Vault Operation models
 */
export type SmartVaultOperation =
  Prisma.Prisma.SmartVaultOperationGetPayload<{}>;

export const SmartVaultOperationType = Prisma.SmartVaultOperationType;

export const SmartVaultOperationStatus = Prisma.SmartVaultOperationStatus;

/**
 * Smart Vault Asset models
 */
export type SmartVaultAsset = Prisma.Prisma.SmartVaultAssetGetPayload<{}>;

/**
 * Smart Vault Strategy models
 */
export type SmartVaultStrategy = Prisma.Prisma.SmartVaultStrategyGetPayload<{}>;
