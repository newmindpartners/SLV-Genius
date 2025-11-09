import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {PrismaClient} from '@prisma/client';

import * as Public from '~/domain/models/public';

import {StakeVaultApplication} from '~/application/stakeVault.application';

import {ConfigService} from '~/domain/services';

import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';

import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';

@singleton()
export class StakeVaultMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService') configService: ConfigService,
    @inject('PrismaClient') private readonly prisma: PrismaClient,
    @inject(StakeVaultApplication)
    private readonly stakeVaultsApplication: StakeVaultApplication
  ) {
    super(configService);
  }

  async stakeVaultCreate(
    req: FastifyRequest<{Body: Public.CreateStakeVault}>
  ): Promise<Public.UnsignedStakeVault> {
    return await this.prisma.$transaction(async prisma => {
      if (req.user) {
        const {
          walletAddress,
          walletUsedAddresses,
          walletUnusedAddresses,
          collateralUtxo,

          stakingProjectId,
          stakingNfts,
          stakedAssetAmount,
          lockDuration,
        } = req.body;

        const wallet: Public.WalletAccount = {
          walletAddress,
          walletUsedAddresses,
          walletUnusedAddresses,
          collateralUtxo,
        };

        const data: Public.StakeVaultData = {
          stakingProjectId,
          stakedAssetAmount,
          lockDuration,
          stakingNfts,
        };

        return this.stakeVaultsApplication.createStakeVault(
          prisma,
          req.user,
          data,
          wallet
        );
      } else {
        throw new ApplicationError(
          ErrorCode.STAKE_VAULT__USER_NOT_ATTACHED_TO_REQUEST
        );
      }
    }, this.configService.getPrismaTransactionOptions());
  }

  async stakeVaultUnstake(
    req: FastifyRequest<{Body: Public.UnstakeStakeVault}>
  ): Promise<Public.UnsignedUnstakeStakeVault> {
    return await this.prisma.$transaction(async prisma => {
      const {
        walletAddress,
        walletUsedAddresses,
        walletUnusedAddresses,
        collateralUtxo,

        stakeVaultId,
      } = req.body;

      const wallet: Public.WalletAccount = {
        walletAddress,
        walletUsedAddresses,
        walletUnusedAddresses,
        collateralUtxo,
      };

      const data: Public.UnstakeStakeVaultData = {
        stakeVaultId,
      };

      return this.stakeVaultsApplication.unstakeStakeVault(
        prisma,
        data,
        wallet
      );
    }, this.configService.getPrismaTransactionOptions());
  }
}
