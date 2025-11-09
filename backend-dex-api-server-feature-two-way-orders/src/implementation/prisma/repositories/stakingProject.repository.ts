import {inject, injectable, singleton} from 'tsyringe';

import * as Prisma from '@prisma/client';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';
import {StakingProjectRepository} from '~/domain/repositories';
import {StakingProjectService} from '~/domain/services/stakingProject.service';

@singleton()
@injectable()
export class StakingProjectRepositoryPrisma
  implements StakingProjectRepository
{
  constructor(
    @inject('StakingProjectService')
    private readonly stakingProjectService: StakingProjectService,

    @inject('DomainMapper')
    private readonly domainMapper: DomainMapper
  ) {}

  async getStakingProjectByStakingProjectId(
    prisma: Prisma.Prisma.TransactionClient,
    stakingProjectId: string
  ): Promise<Private.StakingProject> {
    return prisma.stakingProject.findUniqueOrThrow({
      where: {stakingProjectId},
    });
  }

  async getStakingProjectByAssetShortName(
    prisma: Prisma.Prisma.TransactionClient,
    assetShortName: string
  ): Promise<Private.StakingProject | null> {
    return prisma.stakingProject.findFirst({
      where: {
        project: {
          asset: {
            shortName: assetShortName,
          },
        },
      },
    });
  }

  async getStakingProjectAsset(
    prisma: Prisma.Prisma.TransactionClient,
    stakingProjectId: string
  ): Promise<Public.Asset> {
    const prismaStakingProject = await prisma.stakingProject.findUniqueOrThrow({
      where: {stakingProjectId},
    });

    const projectId = prismaStakingProject.projectId;

    const prismaProject = await prisma.project.findUniqueOrThrow({
      where: {projectId},
      include: {
        asset: true,
      },
    });

    const prismaAsset: Prisma.Asset = prismaProject.asset;

    const publicAsset: Public.Asset = {
      assetId: prismaAsset.assetId,
      policyId: prismaAsset.policyId,
      assetName: prismaAsset.assetName,
      iconUrl: prismaAsset.iconUrl || '',
      shortName: prismaAsset.shortName || '',
      longName: prismaAsset.longName || '',
      decimalPrecision: prismaAsset.decimalPrecision,
      enabled: prismaAsset.webEnabled,
    };

    return Promise.resolve(publicAsset);
  }

  // TODO @christopher? Implement cursor using `query` same way as `GET /projects`
  async listStakingProjects(
    prisma: Prisma.Prisma.TransactionClient,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query: Private.StakingProjectsQuery
  ): Promise<Public.StakingProject[]> {
    const stakingProjects = await prisma.stakingProject.findMany({
      orderBy: {created: 'asc'},
      where: {webEnabled: true},
      include: {project: {include: {asset: true}}},
    });

    const publicStakingProjects: Promise<Public.StakingProject>[] =
      stakingProjects.map(async stakingProject => {
        const {
          project: {asset},
        } = stakingProject;

        // TODO @christopher? domain mapper should not be used in repository layer
        // We do not want to make use of public types internally.
        const baseAsset = this.domainMapper.toPublicAsset(asset);

        const lockOptions = await this.listStakingProjectLockOptions(
          prisma,
          stakingProject.stakingProjectId
        );

        const unorderedLockDurations = lockOptions.map(
          stakingProjectLockOption => stakingProjectLockOption.lockDuration
        );

        const sortedLockDurations =
          this.stakingProjectService.sortLockDurations(unorderedLockDurations);

        // TODO @christopher? the repository layer should not return data in public type structures
        const publicStakingProject: Public.StakingProject = {
          stakingAsset: baseAsset,
          stakingProjectId: stakingProject.stakingProjectId,
          lockDurationOptions: sortedLockDurations,
          imageLogoUrl: stakingProject.project.imageLogoUrl,
        };

        return publicStakingProject;
      });

    return Promise.all(publicStakingProjects);
  }

  async listStakingProjectLockOptions(
    prisma: Prisma.Prisma.TransactionClient,
    stakingProjectId: string
  ): Promise<Private.StakingProjectLockOption[]> {
    const stakingProjectLockOptions =
      await prisma.stakingProjectLockOption.findMany({
        /**
         * Ordering by ascending APY will implicitly order by ascending
         * monthly lock duration.
         * It may seem better to order by ascending lock duration i.e.
         * `MONTHS_3` before `MONTHS_6`, but that would not work with
         * future `FLEX` options.
         */
        orderBy: {
          apy: 'asc',
        },
        where: {stakingProjectId},
      });

    return stakingProjectLockOptions;
  }

  async getStakingProjectLockOption(
    prisma: Prisma.Prisma.TransactionClient,
    stakingProjectId: string,
    lockDuration: Prisma.StakeVaultLockDuration
  ): Promise<Private.StakingProjectLockOption | null> {
    const stakingProjectLockOption =
      await prisma.stakingProjectLockOption.findUnique({
        where: {
          stakingProjectId_lockDuration: {
            stakingProjectId,
            lockDuration,
          },
        },
      });

    return stakingProjectLockOption;
  }

  async listStakingProjectNfts(
    prisma: Prisma.Prisma.TransactionClient,
    stakingProjectId: string
  ): Promise<Private.StakingNft[]> {
    const stakingNfts: Private.StakingNft[] = (
      await prisma.stakingProjectNft.findMany({
        where: {
          stakingProjectId,
        },
        include: {
          stakingNft: true,
        },
      })
    ).map(({stakingNft}) => stakingNft);

    return Promise.all(stakingNfts);
  }

  async getSigningServerUrl(
    prisma: Prisma.Prisma.TransactionClient,
    stakingProjectId: string
  ): Promise<string | null> {
    const stakingProject = await prisma.stakingProject.findUniqueOrThrow({
      select: {
        signingServerUrl: true,
      },
      where: {stakingProjectId},
    });

    return stakingProject.signingServerUrl;
  }
}
