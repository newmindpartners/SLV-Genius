import {inject, injectable, singleton} from 'tsyringe';

import * as Prisma from '@prisma/client';
import * as Core from '~/domain/models/core';
import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {
  StakeVaultRepository,
  StakingNftRepository,
  StakingProjectRepository,
  TransactionRepository,
} from '~/domain/repositories';

import {DomainMapper} from '../domain.mapper';

import {PublicError, PublicErrorCode} from '~/domain/errors';

import {assetId as getAssetId} from '~/domain/utils/asset.util';
import * as stakingUtil from '~/domain/utils/staking.util';
import {now} from '~/domain/utils/date.util';
import * as _ from 'lodash';
import {parseStringNumberToBigInt} from '~/domain/utils/math.util';
import {subMinutes} from 'date-fns';

@singleton()
@injectable()
export class StakeVaultRepositoryPrisma implements StakeVaultRepository {
  constructor(
    @inject('DomainMapper')
    private domainMapper: DomainMapper,

    @inject('StakingProjectRepository')
    private readonly stakingProjectRepository: StakingProjectRepository,

    @inject('StakingNftRepository')
    private readonly stakingNftRepository: StakingNftRepository,

    @inject('TransactionRepository')
    private transactionRepository: TransactionRepository
  ) {}

  async listStakeVaultsByStakeKeyHash(
    prisma: Prisma.Prisma.TransactionClient,
    ownerWalletStakeKeyHash: string
  ): Promise<Private.StakeVault[]> {
    const stakeVaults = await prisma.stakeVault.findMany({
      include: {
        stakeVaultEvent: true,
      },
      orderBy: {
        created: 'asc',
      },
      where: {
        AND: [
          {user: {walletStakeKeyHash: ownerWalletStakeKeyHash}},
          this.getEligibleStakeVaultWhereInputs(),
        ],
      },
    });

    return stakeVaults;
  }

  async getStakeVaultCreateEvent(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultId: string
  ): Promise<Private.StakeVaultEvent> {
    const isSubmittedRecentlyOrOnChain =
      this.getSubmittedRecentlyOrOnChainWhereInput();

    const stakeVaultCreateEvents = await prisma.stakeVaultEvent.findMany({
      where: {
        stakeVaultId,
        eventType: 'CREATE',
        ...isSubmittedRecentlyOrOnChain,
      },
    });

    const stakeVaultCreateEvent = stakeVaultCreateEvents[0];

    if (!stakeVaultCreateEvent) {
      throw new Error(
        'A stake vault exist without a CREATE event, this should not be possible'
      );
    }

    return stakeVaultCreateEvent;
  }

  async isStakeVaultUnstaked(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultId: string
  ): Promise<boolean> {
    const isSubmittedRecentlyOrOnChain =
      this.getSubmittedRecentlyOrOnChainWhereInput();

    const submittedOrOnChainUnstakeEvents =
      await prisma.stakeVaultEvent.findMany({
        where: {
          stakeVaultId,
          eventType: 'UNSTAKE',
          ...isSubmittedRecentlyOrOnChain,
        },
      });

    return !_.isEmpty(submittedOrOnChainUnstakeEvents);
  }

  async getStakeVaultStakedNftsByStakeVaultId(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultId: string
  ): Promise<Private.StakingNftWithMintingData[]> {
    const stakeVaultEventNft = await prisma.stakeVaultEventNft.findMany({
      where: {
        stakeVaultEvent: {
          stakeVaultId,
        },
      },
      include: {
        stakingNftMintingData: {
          include: {
            stakingNft: true,
          },
        },
      },
    });

    const stakingNfts: Private.StakingNftWithMintingData[] =
      stakeVaultEventNft.flatMap(({stakingNftMintingData}) => {
        if (stakingNftMintingData) {
          const {stakingNft, ...rest} = stakingNftMintingData;
          return [
            {
              ...stakingNft,
              stakingNftMintingData: rest,
            },
          ];
        } else {
          return [];
        }
      });

    return stakingNfts;
  }

  async getStakeVaultByStakeVaultId(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultId: string
  ): Promise<Private.StakeVault> {
    return prisma.stakeVault.findUniqueOrThrow({
      include: {
        stakeVaultEvent: true,
      },
      where: {
        stakeVaultId,
      },
    });
  }

  async getAggregateStakeVaultEventsStakedAmountByStakingProjectId(
    prisma: Prisma.Prisma.TransactionClient,
    stakingProjectId: string
  ): Promise<Private.AggregateStakingProjectStakedAmounts | null> {
    const stakingProject =
      await this.stakingProjectRepository.getStakingProjectByStakingProjectId(
        prisma,
        stakingProjectId
      );

    const stakedAssetTotalAmountLimit =
      stakingProject.stakedAssetTotalAmountLimit;

    if (stakedAssetTotalAmountLimit) {
      const isSubmittedRecentlyOrOnChain =
        this.getSubmittedRecentlyOrOnChainWhereInput();

      const stakeVaultEventAggregate = await prisma.stakeVaultEvent.aggregate({
        where: {
          stakeVault: {
            stakingProjectId: stakingProject.stakingProjectId,
            stakeVaultEvent: {
              some: {
                eventType: 'CREATE',
                ...isSubmittedRecentlyOrOnChain,
              },
            },
          },
        },
        _sum: {
          stakedAssetAmount: true,
        },
      });

      const stakedAssetTotalAmount =
        stakeVaultEventAggregate._sum.stakedAssetAmount || BigInt(0);

      return {
        stakedAssetTotalAmount,
        stakedAssetTotalAmountLimit,
      };
    } else {
      return Promise.resolve(null);
    }
  }

  private getSubmittedRecentlyOrOnChainWhereInput(): Prisma.Prisma.StakeVaultEventWhereInput {
    const isOnChain: Prisma.Prisma.TransactionWhereInput = {
      block: {
        isRollBack: false,
      },
    };

    /**
     * Because it takes a while for Oura to add Block entities and associate Transactions
     * with them, we optimistically consider a Transaction to be on-chain for a period
     * of time after it has been submitted, even though it does not have a block relation.
     */
    const isSubmittedRecently: Prisma.Prisma.TransactionWhereInput = {
      isSubmitted: true,
      block: null,
      transactionDate: {gt: subMinutes(new Date(), 15)},
    };

    return {
      OR: [
        {transaction: isOnChain},
        {
          transaction: isSubmittedRecently,
        },
      ],
    };
  }

  private getEligibleStakeVaultWhereInputs(): Prisma.Prisma.StakeVaultWhereInput {
    const stakeVaultEventWhereInputs =
      this.getSubmittedRecentlyOrOnChainWhereInput();

    return {
      stakeVaultEvent: {
        none: {
          eventType: 'UNSTAKE',
          ...stakeVaultEventWhereInputs,
        },
        some: {
          eventType: 'CREATE',
          ...stakeVaultEventWhereInputs,
        },
      },
    };
  }

  private getSubmittedOrOnChainStakeVaultWhereInput(): Prisma.Prisma.StakeVaultWhereInput {
    const stakeVaultEventWhereInputs =
      this.getSubmittedRecentlyOrOnChainWhereInput();

    return {
      stakeVaultEvent: {
        some: {
          eventType: 'CREATE',
          ...stakeVaultEventWhereInputs,
        },
      },
    };
  }

  async getStakeVaultByTxHashAndIndex(
    prisma: Prisma.Prisma.TransactionClient,
    txHash: string,
    txIndex: number
  ): Promise<Private.StakeVault> {
    const stakeVault: Private.StakeVault = (await prisma.stakeVault.findFirst({
      include: {
        stakeVaultEvent: true,
      },
      where: {
        stakeVaultEvent: {
          some: {
            transaction: {
              transactionOutput: {
                some: {
                  transactionHash: txHash,
                  index: txIndex,
                },
              },
            },
          },
        },
      },
    })) as Private.StakeVault;

    return stakeVault;
  }

  async getAssetByStakeVaultId(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultId: string
  ): Promise<Private.Asset> {
    const stakeVault = await prisma.stakeVault.findUniqueOrThrow({
      where: {
        stakeVaultId,
      },
      select: {
        stakingProject: {
          select: {
            project: {
              select: {
                asset: true,
              },
            },
          },
        },
      },
    });

    return stakeVault.stakingProject.project.asset;
  }

  async userHasStakedVestingNft(
    prisma: Prisma.Prisma.TransactionClient,
    ownerWalletStakeKeyHash: string
  ): Promise<boolean> {
    const allStakeVaults = await prisma.stakeVault.findMany({
      include: {
        stakeVaultEvent: true,
      },
      orderBy: {
        created: 'asc',
      },
      where: {
        AND: [
          {user: {walletStakeKeyHash: ownerWalletStakeKeyHash}},
          this.getSubmittedOrOnChainStakeVaultWhereInput(),
        ],
      },
    });

    const allStakedStakingNftTypes = (
      await Promise.all(
        allStakeVaults.map(async stakeVault => {
          const stakeVaultEvents = await prisma.stakeVaultEvent.findMany({
            where: {stakeVaultId: stakeVault.stakeVaultId},
            include: {stakeVaultEventNft: true},
          });

          const stakingNftMintingDataAssetIds = stakeVaultEvents
            .flatMap(event => event.stakeVaultEventNft)
            .map(nft => nft.stakingNftMintingDataAssetId);

          const stakingNftTypes = await Promise.all(
            stakingNftMintingDataAssetIds.map(
              async assetId =>
                await this.stakingNftRepository
                  .getStakingNftMintingDataByAssetIdOrThrow(prisma, assetId)
                  .then(mintingData => mintingData.stakingNftType)
            )
          );

          return stakingNftTypes;
        })
      )
    ).flat();

    const containsVestingNftType = allStakedStakingNftTypes.reduce(
      (containsVesting, stakingNftType) =>
        containsVesting || stakingUtil.isVestingNft(stakingNftType),
      false
    );

    return containsVestingNftType;
  }

  async createStakeVault(
    prisma: Prisma.Prisma.TransactionClient,
    user: Private.User,
    unsignedStakeVault: Public.UnsignedStakeVault,
    unsignedTransaction: Private.UnsignedTransaction & Core.Transaction,
    startedAt: Date
  ): Promise<Public.UnsignedStakeVault> {
    const stakedStakingNfts: Public.StakingNft[] = await Promise.all(
      unsignedStakeVault.stakingNfts.map(
        async ({type, subType, assetName, policyId}) => {
          const stakingNft: Private.StakingNft =
            await this.stakingNftRepository.getStakingNftByTypeAndSubType(
              prisma,
              type,
              subType
            );

          const publicStakingNft = this.domainMapper.toPublicStakingNft(
            stakingNft,
            {assetName, policyId},
            /**
             * We should pass vesting amount here, but we get away with it
             * because we no longer allow for vesting NFTs to be staked.
             */
            null
          );

          return publicStakingNft;
        }
      )
    );

    const stakedAssetAmount = parseStringNumberToBigInt(
      unsignedStakeVault.stakedAssetAmount
    );

    const stakingProject =
      await this.stakingProjectRepository.getStakingProjectByStakingProjectId(
        prisma,
        unsignedStakeVault.stakingProjectId
      );

    const lockOption =
      await this.stakingProjectRepository.getStakingProjectLockOption(
        prisma,
        unsignedStakeVault.stakingProjectId,
        unsignedStakeVault.lockDuration
      );

    if (!lockOption) {
      throw new PublicError(
        PublicErrorCode.INVALID_STAKE_VAULT__INVALID_LOCK_DURATION
      );
    }

    const prismaStakeVault = await prisma.stakeVault.create({
      data: {
        user: {connect: {userId: user.userId}},
        stakingProject: {
          connect: {stakingProjectId: unsignedStakeVault.stakingProjectId},
        },
        type: stakingProject.stakeVaultType,
        lockDuration: lockOption.lockDuration,
        lockApy: lockOption.apy,
        revenueAmplifier: lockOption.revenueAmplifier,
        startedAt: startedAt,
        unlocksAt: unsignedStakeVault.unlocksAt,
      },
    });

    const prismaStakeVaultEvent = await this.saveStakeVaultEventCreate(
      prisma,
      unsignedTransaction,
      stakedAssetAmount,
      prismaStakeVault.stakeVaultId
    );

    for (const stakingNft of unsignedStakeVault.stakingNfts) {
      const {assetId} = await prisma.stakingNftMintingData.findUniqueOrThrow({
        where: {
          // As a precaution. We should treat all assetNames the same regardless of case.
          assetId: getAssetId(
            stakingNft.policyId,
            stakingNft.assetName.toLowerCase()
          ),
        },
      });

      await prisma.stakeVaultEventNft.create({
        data: {
          stakeVaultEventId: prismaStakeVaultEvent.stakeVaultEventId,
          stakingNftMintingDataAssetId: assetId,
        },
      });
    }

    const unsignedStakeVaultTransaction: Public.UnsignedStakeVault = {
      stakeVaultId: prismaStakeVault.stakeVaultId,
      stakingProjectId: unsignedStakeVault.stakingProjectId,
      stakedAssetAmount: unsignedStakeVault.stakedAssetAmount,
      lockDuration: unsignedStakeVault.lockDuration,
      unlocksAt: unsignedStakeVault.unlocksAt,
      stakingNfts: stakedStakingNfts.map(nft => ({
        type: nft.type,
        subType: nft.subType,
        assetName: nft.assetName,
        policyId: nft.policyId,
      })),
      ...unsignedTransaction,
      // TODO: Comment this
      transactionId: prismaStakeVaultEvent.stakeVaultEventId,
      transactionUrl: unsignedStakeVault.transactionUrl,
    };

    return Promise.resolve(unsignedStakeVaultTransaction);
  }

  private async saveStakeVaultEventCreate(
    prisma: Prisma.Prisma.TransactionClient,
    unsignedTransaction: Core.Transaction,
    stakedAssetAmount: bigint | null,
    stakeVaultId: string
  ) {
    const existingCreateEvents = await prisma.stakeVaultEvent.findMany({
      where: {
        eventType: 'CREATE',
        transactionHash: unsignedTransaction.transactionHash,
      },
    });

    const existingCreateEventIds = existingCreateEvents.map(
      event => event.stakeVaultEventId
    );

    /**
     * To avoid creating duplicate CREATE stake vault events for the same transaction,
     * we update any existing stake vault event to detach from the transaction.
     * This ensure that we only ever display one stake vault per transaction.
     * See https://github.com/geniusyield/dex-api-server/pull/2291
     */
    await prisma.stakeVaultEvent.updateMany({
      where: {
        stakeVaultEventId: {
          in: existingCreateEventIds,
        },
      },
      data: {
        transactionHash: null,
      },
    });

    const transactionNestedCreate =
      this.transactionRepository.createRelatedTransaction(unsignedTransaction);

    const created = now();

    return await prisma.stakeVaultEvent.create({
      data: {
        eventType: 'CREATE',

        // Persist transaction, inputs and outputs
        transaction: {
          connectOrCreate: {
            where: {transactionHash: unsignedTransaction.transactionHash},
            create: transactionNestedCreate.transaction.create,
          },
        },

        stakedAssetAmount: stakedAssetAmount || 0,
        stakeVault: {
          connect: {stakeVaultId},
        },
        created,
        eventDate: created,
      },
    });
  }

  async createStakeVaultUnstakeEvent(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultId: string,
    unsignedTransaction: Private.UnsignedTransaction & Core.Transaction
  ): Promise<Private.StakeVaultEvent> {
    const stakeVaultEvent = await this.saveStakeVaultEventUnstake(
      prisma,
      unsignedTransaction,
      stakeVaultId
    );

    return stakeVaultEvent;
  }

  async getStakeVaultsByNftAssetId(
    prisma: Prisma.Prisma.TransactionClient,
    assetId: string
  ): Promise<Private.StakeVaultWithEvents[]> {
    const isSubmittedRecentlyOrOnChain =
      this.getSubmittedRecentlyOrOnChainWhereInput();

    return prisma.stakeVault.findMany({
      include: {stakeVaultEvent: true},
      where: {
        stakeVaultEvent: {
          /**
           * Check if there is a `CREATE` event that is on-chain and has this
           * assetId as part of it's staked NFTs.
           */
          some: {
            eventType: 'CREATE',
            ...isSubmittedRecentlyOrOnChain,
            stakeVaultEventNft: {
              some: {
                stakingNftMintingDataAssetId: assetId,
              },
            },
          },
        },
      },
    });
  }

  private async saveStakeVaultEventUnstake(
    prisma: Prisma.Prisma.TransactionClient,
    unsignedTransaction: Core.Transaction,
    stakeVaultId: string
  ) {
    const transactionNestedCreate =
      this.transactionRepository.createRelatedTransaction(unsignedTransaction);

    const created = now();
    const stakeVaultEvent = await prisma.stakeVaultEvent.create({
      data: {
        eventType: 'UNSTAKE',

        stakedAssetAmount: 0,

        created,
        eventDate: created,

        // Persist transaction, inputs and outputs
        transaction: {
          connectOrCreate: {
            where: {transactionHash: unsignedTransaction.transactionHash},
            create: transactionNestedCreate.transaction.create,
          },
        },

        stakeVault: {
          connect: {stakeVaultId},
        },
      },
    });

    return stakeVaultEvent;
  }

  async getStakeVaultEventNftsByStakeVaultEventId(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultEventId: string
  ): Promise<Private.StakeVaultEventNft[]> {
    const stakeVaultEventNfts = await prisma.stakeVaultEventNft.findMany({
      where: {stakeVaultEventId},
    });

    return stakeVaultEventNfts;
  }

  async getStakingNftMintingDataByStakeVaultEventNft(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultEventNft: Private.StakeVaultEventNft
  ): Promise<Private.StakingNftMintingData> {
    const stakingNftMintingDataAssetId =
      stakeVaultEventNft.stakingNftMintingDataAssetId;

    return prisma.stakingNftMintingData.findUniqueOrThrow({
      where: {assetId: stakingNftMintingDataAssetId},
    });
  }

  async getStakingNftByStakeVaultEventNft(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultEventNft: Private.StakeVaultEventNft
  ): Promise<Private.StakingNftWithMintingData> {
    const stakingNftMintingData: Private.StakingNftMintingData =
      await this.getStakingNftMintingDataByStakeVaultEventNft(
        prisma,
        stakeVaultEventNft
      );

    const {stakingNftType, stakingNftSubType} = stakingNftMintingData;

    const stakingNft: Private.StakingNft =
      await prisma.stakingNft.findUniqueOrThrow({
        where: {
          type_subType: {type: stakingNftType, subType: stakingNftSubType},
        },
      });

    const stakingNftWithMintingData: Private.StakingNftWithMintingData = {
      ...stakingNft,
      stakingNftMintingData,
    };

    return stakingNftWithMintingData;
  }

  async getStakeVaultStakedAssetAmount(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultId: string
  ): Promise<bigint> {
    /**
     * By creating a raw query instead of using Prisma `where` argument,
     * we increase the performance by roughly 80x.
     *
     * Query with `getOptimisticOnChainStakeVaultWhereInput`
     * total_exec_time: 40.52546391406251
     *
     * Below `queryRaw`
     * total_exec_time: 0.5200272777777777
     *
     * The reason our original query is so slow is because Prisma generates
     * a lot of unnecessary subqueries rather than creating joins. This causes
     * the query to be very slow because it iterates our tables unecessarily.
     *
     * This was measured using `pg_stat_statements`
     * `select query, mean_exec_time, calls from pg_stat_statements ORDER BY mean_exec_time DESC limit 20;`
     */
    const results = await prisma.$queryRaw<
      Array<{
        total_staked_asset_amount: bigint;
      }>
    >`
          SELECT
            CAST(SUM(sve.staked_asset_amount) AS BIGINT) as total_staked_asset_amount
          FROM
            public.stake_vault_event AS sve
          INNER JOIN
            public.transaction AS tx ON tx.transaction_hash = sve.transaction_hash
          LEFT JOIN
            public.block AS block ON block.block_hash = tx.block_hash
          WHERE
            sve.stake_vault_id = ${stakeVaultId}::UUID
            AND sve.event_type = 'CREATE'
            AND (
              (tx.is_submitted = true AND tx.block_hash IS NULL)
              OR
              (block.block_hash IS NOT NULL AND block.is_roll_back = false)
            )
          ;`;

    return results[0]?.total_staked_asset_amount ?? BigInt(0);
  }

  async getStakeVaultBlockSlotDate(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultId: string
  ): Promise<Private.Block['slotDate']> {
    const isSubmittedRecentlyOrOnChain =
      this.getSubmittedRecentlyOrOnChainWhereInput();

    const stakeVaultCreateEvents = await prisma.stakeVaultEvent.findMany({
      where: {
        stakeVaultId,
        eventType: 'CREATE',
        ...isSubmittedRecentlyOrOnChain,
      },
      select: {
        transaction: {
          select: {
            block: {
              select: {
                slotDate: true,
              },
            },
          },
        },
      },
    });

    const stakeVaultCreateEvent = stakeVaultCreateEvents[0];

    return stakeVaultCreateEvent?.transaction?.block?.slotDate || null;
  }

  async getStakeVaultEventBlockContextTimestamp(
    prisma: Prisma.Prisma.TransactionClient,
    stakeVaultEventId: string
  ): Promise<Private.Block['slotDate']> {
    const stakeVaultEvent = await prisma.stakeVaultEvent.findUniqueOrThrow({
      where: {stakeVaultEventId},
      select: {
        transaction: {
          select: {
            block: {
              select: {
                slotDate: true,
              },
            },
          },
        },
      },
    });

    return stakeVaultEvent.transaction?.block?.slotDate || null;
  }
}
