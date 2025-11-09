import * as Prisma from '@prisma/client';

export type SmartVaultAssetAggregate = {
  smartVaultId: string;
  smartVaultAssets: Pick<
    Prisma.Prisma.SmartVaultAssetGetPayload<{}>,
    'assetId'
  >[];
};
