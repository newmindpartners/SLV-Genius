import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {PrismaClient} from '@prisma/client';

import {ConfigService} from '~/domain/services';

import {StakeVaultApplication} from '~/application/stakeVault.application';

import {AbstractQuery} from '~/implementation/fastify/abstract.query';

type StakeVaultNftUsageReportRequest = {assetId: string};

@singleton()
export class StakeVaultQueryFastify extends AbstractQuery {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject(StakeVaultApplication)
    private readonly stakeVaultsApplication: StakeVaultApplication
  ) {
    super(configService);
  }

  async listStakeVaults(
    req: FastifyRequest<{Querystring: Private.StakeVaultsQuery}>
  ): Promise<Private.PaginatedResults<Public.StakeVault>> {
    return this.stakeVaultsApplication.listStakeVaultsByStakeKeyHash(
      this.prisma,
      req.query
    );
  }

  async getStakeVaultNftUsageReport(
    req: FastifyRequest<{Params: StakeVaultNftUsageReportRequest}>
  ): Promise<Public.StakeVaultNftUsageReport> {
    return this.stakeVaultsApplication.getStakeVaultNftUsageReport(
      this.prisma,
      req.params.assetId
    );
  }

  async getStakingRewardsEstimate(
    req: FastifyRequest<{Body: Public.CreateStakeVault}>
  ): Promise<Public.StakeVaultCreateRewardsEstimate> {
    const walletAccount: Public.WalletAccount = {
      walletAddress: req.body.walletAddress,
      walletUnusedAddresses: req.body.walletUnusedAddresses,
      walletUsedAddresses: req.body.walletUsedAddresses,
      collateralUtxo: req.body.collateralUtxo,
    };

    return this.prisma.$transaction(
      async prisma =>
        this.stakeVaultsApplication.getStakingRewardsEstimate(
          prisma,
          walletAccount,
          req.body
        ),
      this.configService.getPrismaTransactionOptions()
    );
  }
}
