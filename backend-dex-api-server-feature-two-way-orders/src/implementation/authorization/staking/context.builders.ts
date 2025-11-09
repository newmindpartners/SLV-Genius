import {FastifyRequest} from 'fastify';
import {PrismaClient} from '@prisma/client';
import * as Private from '~/domain/models/private';
import {StakingNftInput, UniqueStakingNft} from './types';
import {ContextInput} from '../types';
import {container} from 'tsyringe';
import {StakingNftRepository} from '~/domain/repositories/stakingNft.repository';
import {ErrorCode} from '~/domain/errors';
import {
  StakeVaultRepository,
  StakingProjectRepository,
} from '~/domain/repositories';
import {CreateStakeVault} from '~/domain/models/public';
import {ConfigService, StakeVaultService} from '~/domain/services';
import {ApplicationError} from '~/application/application.error';
import {AuthUserContext} from '../user';

export interface StakingNftsRequest {
  stakingNfts: StakingNftInput[];
}

export interface StakingNftsContext {
  stakingNfts: UniqueStakingNft[];
}

export interface StakeVaultCreateContext {
  isStakedAssetTotalAmountLimitReached: boolean;
}

export type CreateStakeVaultEnabledContext = {
  isCreateStakeVaultEnabled: boolean;
};

export type StakeVaultContext = {
  stakeVault: Private.StakeVault;
};

export type StakingProjectContext = {
  stakingProject: Private.StakingProject;
};

export type StakeVaultCreateEligibilityContext = StakeVaultContext &
  StakingProjectContext &
  CreateStakeVaultEnabledContext &
  Pick<AuthUserContext, 'user'>;

interface StakeVaultIdRequest {
  stakeVaultId: string;
}

interface StakingProjectIdRequest {
  stakingProjectId: string;
}

export const isStakingNftInput = (
  input: Record<string, unknown>
): input is StakingNftInput =>
  typeof input.type === 'string' &&
  typeof input.subType === 'string' &&
  typeof input.assetName === 'string';

export const isStakingNftsPresentInRequest = (
  req: FastifyRequest
): req is FastifyRequest<{Body: StakingNftsRequest}> => {
  const stakingNfts = (req as FastifyRequest<{Body: StakingNftsRequest}>)?.body
    ?.stakingNfts;

  return (
    stakingNfts !== undefined &&
    Array.isArray(stakingNfts) &&
    stakingNfts.every(isStakingNftInput)
  );
};

const isStakeVaultIdPresentInRequest = (
  req: FastifyRequest
): req is FastifyRequest<{
  Body: StakeVaultIdRequest;
}> =>
  (req as FastifyRequest<{Body: StakeVaultIdRequest}>)?.body?.stakeVaultId !==
  undefined;

const isStakingProjectIdPresentInRequest = (
  req: FastifyRequest
): req is FastifyRequest<{
  Body: StakingProjectIdRequest;
}> =>
  (req as FastifyRequest<{Body: StakingProjectIdRequest}>)?.body
    ?.stakingProjectId !== undefined;

export const stakingNftsContextBuilder =
  (req: FastifyRequest) =>
  async (context: ContextInput<object>): Promise<StakingNftsContext> => {
    if (isStakingNftsPresentInRequest(req)) {
      const prismaClient = container.resolve<PrismaClient>('PrismaClient');
      const stakingNftRepository = container.resolve<StakingNftRepository>(
        'StakingNftRepository'
      );
      const partialStakingNfts = req.body.stakingNfts;
      const stakingNfts: UniqueStakingNft[] = (
        await Promise.all(
          partialStakingNfts.map(stakingNft =>
            stakingNftRepository
              .getStakingNftByTypeAndSubType(
                prismaClient,
                stakingNft.type,
                stakingNft.subType
              )
              .then(stakingNftResult => ({
                type: stakingNftResult.type,
                subType: stakingNftResult.subType,
                stackableWith: stakingNftResult.stackableWith,
                assetName: stakingNft.assetName,
              }))
          )
        )
      ).filter((nft): nft is UniqueStakingNft => nft !== null);

      return {...(await context), stakingNfts};
    } else {
      throw new ApplicationError(
        ErrorCode.STAKE_VAULT__UNEXPECTED_REQUEST_BODY
      );
    }
  };

export const CreateStakeVaultContextBuilder =
  () =>
  async (
    context: ContextInput<object>
  ): Promise<CreateStakeVaultEnabledContext> => {
    const configService = container.resolve<ConfigService>('ConfigService');

    const isCreateStakeVaultEnabled =
      configService.isCreateStakeVaultFeatureEnabled();

    return {...(await context), isCreateStakeVaultEnabled};
  };

export const stakeVaultContextBuilder =
  (req: FastifyRequest) =>
  async (context: ContextInput<object>): Promise<StakeVaultContext> => {
    if (isStakeVaultIdPresentInRequest(req)) {
      const prismaClient = container.resolve<PrismaClient>('PrismaClient');

      const stakeVaultRepository = container.resolve<StakeVaultRepository>(
        'StakeVaultRepository'
      );

      const stakeVault = await stakeVaultRepository.getStakeVaultByStakeVaultId(
        prismaClient,
        req.body.stakeVaultId
      );

      return {...(await context), stakeVault};
    } else {
      throw new ApplicationError(
        ErrorCode.STAKE_VAULT__UNEXPECTED_REQUEST_BODY
      );
    }
  };

export const stakingProjectContextBuilder =
  (req: FastifyRequest) =>
  async (context: ContextInput<object>): Promise<StakingProjectContext> => {
    if (isStakingProjectIdPresentInRequest(req)) {
      const prismaClient = container.resolve<PrismaClient>('PrismaClient');

      const stakingProjectRepository =
        container.resolve<StakingProjectRepository>('StakingProjectRepository');

      const stakingProject =
        await stakingProjectRepository.getStakingProjectByStakingProjectId(
          prismaClient,
          req.body.stakingProjectId
        );

      return {...(await context), stakingProject};
    } else {
      throw new ApplicationError(
        ErrorCode.STAKE_VAULT__UNEXPECTED_REQUEST_BODY
      );
    }
  };

type PartialCreateStakeVault = Pick<
  CreateStakeVault,
  'stakingProjectId' | 'stakedAssetAmount'
>;
type FastifyRequestPartialCreateStakeVault = FastifyRequest<{
  Body: PartialCreateStakeVault;
}>;
export const isBodyInRequestPartialCreateStakeVault = (
  req: FastifyRequest
): req is FastifyRequestPartialCreateStakeVault => {
  const assertedReq = req as FastifyRequestPartialCreateStakeVault;
  const stakingProjectId = assertedReq?.body?.stakingProjectId;

  const stakedAssetAmount = assertedReq?.body?.stakedAssetAmount;

  return (
    typeof stakingProjectId === 'string' &&
    typeof stakedAssetAmount === 'string'
  );
};

export const isStakedAssetTotalAmountLimitReachedContextBuilder =
  (req: FastifyRequest) =>
  async (context: ContextInput<object>): Promise<StakeVaultCreateContext> => {
    if (isBodyInRequestPartialCreateStakeVault(req)) {
      const prismaClient = container.resolve<PrismaClient>('PrismaClient');
      const stakeVaultRepository = container.resolve<StakeVaultRepository>(
        'StakeVaultRepository'
      );
      const stakeVaultService =
        container.resolve<StakeVaultService>('StakeVaultService');

      const aggregateStakedAmounts =
        await stakeVaultRepository.getAggregateStakeVaultEventsStakedAmountByStakingProjectId(
          prismaClient,
          req.body.stakingProjectId
        );

      const isStakedAssetTotalAmountLimitReached =
        stakeVaultService.isStakeVaultTotalAmountReached(
          req.body,
          aggregateStakedAmounts
        );

      return {
        ...(await context),
        isStakedAssetTotalAmountLimitReached,
      };
    } else {
      throw new ApplicationError(
        ErrorCode.STAKE_VAULT__UNEXPECTED_REQUEST_BODY
      );
    }
  };
