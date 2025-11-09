import * as Prisma from '@prisma/client';
import {CardanoNetwork} from '~/domain/models/cardano';
import * as Seed from '~/seed/types';
import {
  isProjectGroupExports,
  ProjectGroupExports,
  SeedProjects,
} from '~/seed/types';

import 'reflect-metadata';
import {ConfigServiceNode} from '~/implementation/node/config.service';

export async function createAssetsSeed(
  prisma: Prisma.Prisma.TransactionClient,
  assets: Seed.Asset[]
): Promise<void> {
  for (const asset of assets) {
    const {assetId} = asset;
    const data = {
      assetId,
      policyId: asset.policyId,
      assetName: asset.assetName,

      iconUrl: asset.iconUrl,
      longName: asset.longName,
      shortName: asset.shortName,
      decimalPrecision: asset.decimalPrecision,

      webEnabled: true,
    };

    await prisma.asset.upsert({
      update: data,
      create: data,
      where: {assetId},
    });
  }
}

export async function createProjectSeed(
  prisma: Prisma.Prisma.TransactionClient,
  project: Seed.Project
): Promise<void> {
  const {projectId} = project;

  const projectData =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Type instantiation is excessively deep and possibly infinite.
    Prisma.Prisma.validator<Prisma.Prisma.ProjectCreateInput>()(project);

  await prisma.project.upsert({
    create: projectData,
    update: projectData,
    where: {projectId},
  });
}

const runNetworkSeed = async (
  prisma: Prisma.Prisma.TransactionClient,
  network: CardanoNetwork,
  project: SeedProjects
) => {
  const projectDirName = project.toLocaleLowerCase();
  const networkDirName = network.toLocaleLowerCase();

  const importPath = `~/seed/data/projects/${projectDirName}/projectGroup/${networkDirName}`;
  const projectGroupFileImport = await import(importPath);

  if (isProjectGroupExports(projectGroupFileImport)) {
    const ProjectGroupExports: ProjectGroupExports = projectGroupFileImport;

    await createAssetsSeed(prisma, Object.values(ProjectGroupExports.assets));

    await createProjectSeed(prisma, ProjectGroupExports.project);
  } else {
    throw new Error(`Could not import seed files on path ${importPath}`);
  }
};

export const runSeed = async (
  prisma: Prisma.PrismaClient,
  config: ConfigServiceNode,
  network: CardanoNetwork,
  project: SeedProjects
) => {
  await Promise.all([
    prisma.$transaction(
      async prisma => await runNetworkSeed(prisma, network, project),
      config.getPrismaTransactionOptions()
    ),
  ]);
};
