import * as Prisma from '@prisma/client';

import * as Seed from '~/seed/types';

import 'reflect-metadata';
import {ConfigServiceNode} from '~/implementation/node/config.service';
import {DevUserExports, isDevUserExports} from '~/seed/types/devUser';

async function createTermsSeed(
  prisma: Prisma.Prisma.TransactionClient,
  walletStakeKeyHash: string
): Promise<void> {
  const data = await prisma.user.updateMany({
    data: {
      acceptedTermsVersion: '0.0.9',
    },
    where: {
      walletStakeKeyHash,
      AND: {acceptedTermsVersion: '1.0.0'},
    },
  });

  if (data.count === 0) {
    await prisma.user.updateMany({
      data: {
        acceptedTermsVersion: '1.0.0',
      },
      where: {
        walletStakeKeyHash,
        AND: {acceptedTermsVersion: '0.0.9'},
      },
    });
    console.info('Upgraded .env user terms version to  1.0.0');
    return;
  }

  console.info('Downgraded .env user terms version to  0.0.9');
}

async function createUserSeed(
  prisma: Prisma.Prisma.TransactionClient,
  user: Seed.User
): Promise<void> {
  const {userId} = user;
  await prisma.user.upsert({
    create: user,
    update: user,
    where: {userId},
  });

  // TODO: Not sure about this one
  // Should probably move to its own file
  await createTermsSeed(prisma, user.walletStakeKeyHash);
}

async function createUserKycSeed(
  prisma: Prisma.Prisma.TransactionClient,
  userKyc: Prisma.UserKyc
): Promise<void> {
  const {userKycId} = userKyc;

  await prisma.userKyc.upsert({
    create: userKyc,
    update: userKyc,
    where: {userKycId},
  });
}

async function createKycEventSeed(
  prisma: Prisma.Prisma.TransactionClient,
  kycEvents: Prisma.KycEvent[]
): Promise<void> {
  for (const kycEvent of kycEvents) {
    const {kycEventId} = kycEvent;

    await prisma.kycEvent.upsert({
      create: kycEvent,
      update: kycEvent,
      where: {kycEventId},
    });
  }
}

const _runSeed = async (prisma: Prisma.Prisma.TransactionClient) => {
  const devUserFileImport = await import('~/seed/data/misc/devUser');

  if (isDevUserExports(devUserFileImport)) {
    const devUserExports: DevUserExports = devUserFileImport;

    await createUserSeed(prisma, devUserExports.user);

    await createUserKycSeed(prisma, devUserExports.userKyc);

    await createKycEventSeed(prisma, devUserExports.kycEvents);

    await createUserSeed(prisma, devUserExports.user2);

    await createUserKycSeed(prisma, devUserExports.userKyc2);

    await createKycEventSeed(prisma, devUserExports.kycEvents2);
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
