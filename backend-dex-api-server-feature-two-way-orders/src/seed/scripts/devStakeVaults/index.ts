import * as Prisma from '@prisma/client';

import * as Seed from '~/seed/types';

import 'reflect-metadata';
import {ConfigServiceNode} from '~/implementation/node/config.service';
import {DevStakeVaultsExports} from '~/seed/types/devStakeVaults';
import {CardanoNetwork} from '~/domain/models/cardano';

async function createStakeVaultsSeed(
  prisma: Prisma.Prisma.TransactionClient,
  stakeVaults: Seed.StakeVault[]
): Promise<void> {
  for (const stakeVault of stakeVaults) {
    await prisma.stakeVault.upsert({
      create: stakeVault,
      update: stakeVault,
      where: {
        stakeVaultId: stakeVault.stakeVaultId,
      },
    });
  }
}

export const validateImport = (
  devStakeVaultsFileImport: unknown
): devStakeVaultsFileImport is DevStakeVaultsExports => {
  if (
    typeof devStakeVaultsFileImport === 'object' &&
    devStakeVaultsFileImport !== null
  ) {
    const requiredKeys: (keyof DevStakeVaultsExports)[] = ['stakeVaults'];
    return requiredKeys.every(key => key in devStakeVaultsFileImport);
  }
  return false;
};

const runNetworkSeed = async (
  prisma: Prisma.Prisma.TransactionClient,
  network: CardanoNetwork,
  project: Seed.SeedProjects
) => {
  const projectDirName = project.toLocaleLowerCase();
  const networkDirName = network.toLocaleLowerCase();

  const importPath = `~/seed/data/projects/${projectDirName}/devStakeVaults/${networkDirName}`;

  const fileImport = await import(importPath);

  if (validateImport(fileImport)) {
    const devStakeVaultsExports: DevStakeVaultsExports = fileImport;

    await createStakeVaultsSeed(prisma, devStakeVaultsExports.stakeVaults);
  } else {
    throw new Error('Could not import seed files');
  }
};

export const runSeed = async (
  prisma: Prisma.PrismaClient,
  config: ConfigServiceNode,
  network: CardanoNetwork,
  project: Seed.SeedProjects
) => {
  await Promise.all([
    prisma.$transaction(
      async prisma => await runNetworkSeed(prisma, network, project),
      config.getPrismaTransactionOptions()
    ),
  ]);
};
