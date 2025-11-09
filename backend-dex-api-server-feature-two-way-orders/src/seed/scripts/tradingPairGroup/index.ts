import {Prisma, PrismaClient} from '@prisma/client';
import {CardanoNetwork} from '~/domain/models/cardano';
import * as Seed from '~/seed/types';
import {isTradingPairGroupExports, TradingPairGroupExports} from '~/seed/types';
import {ConfigServiceNode} from '~/implementation/node/config.service';

export async function createTradingPairSeed(
  prisma: Prisma.TransactionClient,
  tradingPair: Seed.TradingPair
): Promise<void> {
  await prisma.tradingPair.upsert({
    create: tradingPair,
    update: tradingPair,
    where: {tradingPairId: tradingPair.tradingPairId},
  });
}

const runNetworkSeed = async (
  prisma: Prisma.TransactionClient,
  network: CardanoNetwork,
  tradingPairSymbol: string
) => {
  const [baseAssetName, quoteAssetName] = tradingPairSymbol.split('-');

  if (!baseAssetName || !quoteAssetName) {
    throw new Error(
      `--trading-pair-symbol argument must contain both base and quote separated by a -. Argument passed as ${tradingPairSymbol}`
    );
  }

  const projectDirName = baseAssetName.toLocaleLowerCase();
  const quoteAssetFileName = quoteAssetName.toLocaleLowerCase();
  const networkDirName = network.toLocaleLowerCase();

  const importPath =
    `~/seed/data/` +
    `projects/${projectDirName}/` +
    `tradingPairGroup/${networkDirName}/` +
    `tradingPair/${quoteAssetFileName}`;

  const tradingPairGroupFileImport = await import(importPath);

  if (isTradingPairGroupExports(tradingPairGroupFileImport)) {
    const tradingPairGroupExports: TradingPairGroupExports =
      tradingPairGroupFileImport;

    await createTradingPairSeed(prisma, tradingPairGroupExports.tradingPair);
  } else {
    throw new Error(`Could not import seed files on path ${importPath}`);
  }
};

export const runSeed = async (
  prisma: PrismaClient,
  config: ConfigServiceNode,
  network: CardanoNetwork,
  tradingPairSymbol: string
) => {
  await Promise.all([
    prisma.$transaction(
      async prisma => await runNetworkSeed(prisma, network, tradingPairSymbol),
      config.getPrismaTransactionOptions()
    ),
  ]);
};
