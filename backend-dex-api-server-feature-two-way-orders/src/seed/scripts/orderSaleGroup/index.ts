import {Prisma, PrismaClient} from '@prisma/client';
import {CardanoNetwork} from '~/domain/models/cardano';
import * as Seed from '~/seed/types';
import {isOrderSaleGroupExports, OrderSaleGroupExports} from '~/seed/types';
import {ConfigServiceNode} from '~/implementation/node/config.service';

export async function createOrderSaleProjectSeed(
  prisma: Prisma.TransactionClient,
  orderSaleProject: Seed.OrderSaleProject
): Promise<void> {
  const {orderSaleProjectId} = orderSaleProject;

  const orderSaleProjectData =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Type instantiation is excessively deep and possibly infinite.
    Prisma.validator<Prisma.OrderSaleProjectUncheckedCreateInput>()(
      orderSaleProject
    );

  await prisma.orderSaleProject.upsert({
    create: orderSaleProjectData,
    update: orderSaleProjectData,
    where: {orderSaleProjectId},
  });
}

const runNetworkSeed = async (
  prisma: Prisma.TransactionClient,
  network: CardanoNetwork,
  project: Seed.SeedProjects
) => {
  const projectDirName = project.toLocaleLowerCase();
  const networkDirName = network.toLocaleLowerCase();

  const importPath = `~/seed/data/projects/${projectDirName}/orderSaleGroup/${networkDirName}`;
  const orderSaleGroupFileImport = await import(importPath);

  if (isOrderSaleGroupExports(orderSaleGroupFileImport)) {
    const orderSaleGroupExports: OrderSaleGroupExports =
      orderSaleGroupFileImport;

    await createOrderSaleProjectSeed(
      prisma,
      orderSaleGroupExports.orderSaleProject
    );
  } else {
    throw new Error(`Could not import seed files on path ${importPath}`);
  }
};

export const runSeed = async (
  prisma: PrismaClient,
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
