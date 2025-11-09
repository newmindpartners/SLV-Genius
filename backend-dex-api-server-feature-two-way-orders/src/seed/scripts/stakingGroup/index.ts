import * as Prisma from '@prisma/client';

import {CardanoNetwork} from '~/domain/models/cardano';
import * as Seed from '~/seed/types';

import {
  isStakingGroupExports,
  StakingGroupExports,
} from '~/seed/types/stakingGroup';
import {ConfigServiceNode} from '~/implementation/node/config.service';

async function seedStakingProject(
  prisma: Prisma.Prisma.TransactionClient,
  stakingProject: Seed.StakingProject
): Promise<void> {
  await prisma.stakingProject.upsert({
    update: stakingProject,
    create: stakingProject,
    where: {stakingProjectId: stakingProject.stakingProjectId},
  });
}

async function seedStakingProjectLockOptions(
  prisma: Prisma.Prisma.TransactionClient,
  stakingProjectLockOptions: Seed.StakingProjectLockOption[]
): Promise<void> {
  for (const stakingProjectLockOption of stakingProjectLockOptions) {
    await prisma.stakingProjectLockOption.upsert({
      update: stakingProjectLockOption,
      create: stakingProjectLockOption,
      where: {
        stakingProjectLockOptionId:
          stakingProjectLockOption.stakingProjectLockOptionId,
      },
    });
  }
}

async function seedStakingProjectNfts(
  prisma: Prisma.Prisma.TransactionClient,
  stakingProjectNfts: Seed.StakingProjectNft[]
): Promise<void> {
  for (const stakingProjectNft of stakingProjectNfts) {
    await prisma.stakingProjectNft.upsert({
      update: stakingProjectNft,
      create: stakingProjectNft,
      where: {
        stakingProjectId_stakingNftType_stakingNftSubType: {
          stakingProjectId: stakingProjectNft.stakingProjectId,
          stakingNftType: stakingProjectNft.stakingNftType,
          stakingNftSubType: stakingProjectNft.stakingNftSubType,
        },
      },
    });
  }
}

async function seedStakingNfts(
  prisma: Prisma.Prisma.TransactionClient,
  stakingNfts: Seed.StakingNft[],
  stakingNftMintingData: Seed.StakingNftMintingData[]
): Promise<void> {
  for (const stakingNft of stakingNfts) {
    await prisma.stakingNft.upsert({
      update: stakingNft,
      create: stakingNft,
      where: {
        type_subType: {
          type: stakingNft.type,
          subType: stakingNft.subType,
        },
      },
    });
  }

  for (const nftMintingData of stakingNftMintingData) {
    await prisma.stakingNftMintingData.upsert({
      update: nftMintingData,
      create: nftMintingData,
      where: {
        assetId: nftMintingData.assetId,
      },
    });
  }
}

const runNetworkSeed = async (
  prisma: Prisma.Prisma.TransactionClient,
  network: CardanoNetwork,
  project: Seed.SeedProjects
) => {
  const projectDirName = project.toLocaleLowerCase();
  const networkDirName = network.toLocaleLowerCase();

  const importPath = `~/seed/data/projects/${projectDirName}/stakingGroup/${networkDirName}`;
  const stakingGroupFileImport = await import(importPath);

  if (isStakingGroupExports(stakingGroupFileImport)) {
    const StakingGroupExports: StakingGroupExports = stakingGroupFileImport;

    if (StakingGroupExports.stakingNfts) {
      await seedStakingNfts(
        prisma,
        StakingGroupExports.stakingNfts,
        StakingGroupExports.stakingNftMintingDatas || []
      );
    }

    await seedStakingProject(prisma, StakingGroupExports.stakingProject);

    await seedStakingProjectLockOptions(
      prisma,
      StakingGroupExports.stakingProjectLockOptions
    );

    if (StakingGroupExports.stakingProjectNfts) {
      await seedStakingProjectNfts(
        prisma,
        StakingGroupExports.stakingProjectNfts
      );
    }
  } else {
    throw new Error(`Could not import seed files on path ${importPath}`);
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
