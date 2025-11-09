import * as Prisma from '@prisma/client';
import {CardanoNetwork} from '~/domain/models/cardano';
import * as Seed from '~/seed/types';
import {
  CommonGroupExports,
  isCommonGroupExports,
} from '~/seed/types/commonGroup';

import 'reflect-metadata';
import {ConfigServiceNode} from '~/implementation/node/config.service';

async function createAdaAssetSeed(
  prisma: Prisma.Prisma.TransactionClient,
  adaAsset: Seed.Asset
) {
  const assetId = adaAsset.assetId;
  await prisma.asset.upsert({
    where: {
      assetId,
    },
    create: adaAsset,
    update: adaAsset,
  });
}

async function createCountriesSeed(
  prisma: Prisma.Prisma.TransactionClient,
  countries: Seed.Country[]
) {
  for (const country of countries) {
    await prisma.country.upsert({
      where: {
        countryId: country.countryId,
      },
      create: country,
      update: country,
    });
  }
}

const runNetworkSeed = async (
  prisma: Prisma.Prisma.TransactionClient,
  network: CardanoNetwork
) => {
  const networkDirName = network.toLocaleLowerCase();

  const importPath = `~/seed/data/commonGroup/${networkDirName}`;

  const commonGroupFileImport = await import(importPath);

  if (isCommonGroupExports(commonGroupFileImport)) {
    const commonGroupExports: CommonGroupExports = commonGroupFileImport;

    await createCountriesSeed(prisma, commonGroupExports.countries);
    await createAdaAssetSeed(prisma, commonGroupExports.adaAsset);
  } else {
    throw new Error(`Could not import seed files on path ${importPath}`);
  }
};

export const runSeed = async (
  prisma: Prisma.PrismaClient,
  config: ConfigServiceNode,
  network: CardanoNetwork
) => {
  await Promise.all([
    prisma.$transaction(
      async prisma => await runNetworkSeed(prisma, network),
      config.getPrismaTransactionOptions()
    ),
  ]);
};
