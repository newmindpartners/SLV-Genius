import * as Prisma from '@prisma/client';

import 'reflect-metadata';
import {recordHasKey} from '~/domain/utils/typescript.util';
import {ConfigServiceNode} from '~/implementation/node/config.service';
import {
  DevOrderSwapsExports,
  isDevOrderSwapsExport,
} from '~/seed/types/devOrderSwaps';

async function createEventSeed(
  prisma: Prisma.Prisma.TransactionClient,
  events: Prisma.Prisma.EventCreateManyInput[]
): Promise<void> {
  await prisma.event.deleteMany({
    where: {
      eventId: {
        in: events.filter(recordHasKey('eventId')).map(event => event.eventId),
      },
    },
  });
  await prisma.event.createMany({
    data: events,
  });
}

async function createDevOrderSwapSeed(
  prisma: Prisma.Prisma.TransactionClient,
  orderSwaps: Prisma.Prisma.OrderSwapCreateManyInput[]
): Promise<void> {
  await prisma.orderSwap.deleteMany({
    where: {
      orderSwapId: {
        in: orderSwaps
          .filter(recordHasKey('orderSwapId'))
          .map(orderSwap => orderSwap.orderSwapId),
      },
    },
  });
  await prisma.orderSwap.createMany({
    data: orderSwaps,
  });
}

const _runSeed = async (prisma: Prisma.Prisma.TransactionClient) => {
  const orderSwapsFileImport = await import('~/seed/data/misc/devOrderSwaps');

  if (isDevOrderSwapsExport(orderSwapsFileImport)) {
    const orderSwapsExports: DevOrderSwapsExports = orderSwapsFileImport;

    await createEventSeed(prisma, orderSwapsExports.events);
    await createDevOrderSwapSeed(prisma, orderSwapsExports.orderSwaps);
  } else {
    throw new Error('Could not import seed files');
  }
};

export const runSeed = async (
  prisma: Prisma.PrismaClient,
  config: ConfigServiceNode
) => {
  await Promise.all([
    prisma.$transaction(
      async prisma => await _runSeed(prisma),
      config.getPrismaTransactionOptions()
    ),
  ]);
};
