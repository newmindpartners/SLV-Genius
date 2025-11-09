import * as Prisma from '@prisma/client';
/* eslint-disable */
/**
 * Removes all entries in all tables.
 * Source: https://github.com/prisma/docs/issues/451#issuecomment-812424220
 */
export const purgeAllTables = async (prisma: Prisma.PrismaClient) => {
  const modelNames = Prisma.Prisma.dmmf.datamodel.models.map(
    model => model.name
  );

  /**
   * Tables that need to be removed first as they may be referenced by others.
   */
  await prisma.orderSaleBlacklistCountry.deleteMany();
  await prisma.round.deleteMany();
  await prisma.orderSaleProject.deleteMany();
  await prisma.stakeVault.deleteMany();
  await prisma.stakingProjectLockOption.deleteMany();
  await prisma.stakingProjectNft.deleteMany();
  await prisma.stakingProject.deleteMany();
  await prisma.project.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.kycEvent.deleteMany();
  await prisma.userKyc.deleteMany();
  await prisma.user.deleteMany();

  await Promise.all(
    modelNames.map(model => (prisma as any)[model]?.deleteMany())
  );
};
/* eslint-enable */
