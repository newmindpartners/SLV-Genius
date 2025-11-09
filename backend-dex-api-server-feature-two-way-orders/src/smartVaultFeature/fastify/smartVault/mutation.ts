import {inject, singleton} from 'tsyringe';
import {FastifyRequest} from 'fastify';

import {PrismaClient} from '@prisma/client';
import {ConfigService} from '~/domain/services';
import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';
import * as Public from '~/domain/models/public';
import {SmartVaultApplication} from '../../application/smartVault';
import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';
import {pick} from 'lodash';

@singleton()
export class SmartVaultMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject('SmartVaultApplication')
    private readonly smartVaultApplication: SmartVaultApplication
  ) {
    super(configService);
  }

  async open({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.SmartVaultOpen;
  }>): Promise<Public.UnsignedTransaction | Error> {
    const wallet: Public.WalletAccount = pick(body, [
      'walletAddress',
      'collateralUtxo',
      'walletRewardAddresses',
      'walletUsedAddresses',
      'walletUnusedAddresses',
    ]);

    if (user) {
      const data: Public.SmartVaultOpenData = pick(body, [
        'smartVaultStrategyId',
        'smartVaultStrategyConfigJson',
        'depositAssets',
      ]);

      return await this.prisma.$transaction(
        async prisma =>
          this.smartVaultApplication.smartVaultOpen(prisma, user, wallet, data),
        this.configService.getPrismaTransactionOptions()
      );
    } else {
      // Should never happen if `userIsPresentAuthorization` is a pre-handler on this route.
      throw new ApplicationError(ErrorCode.HTTP__USER_NOT_ATTACHED_TO_REQUEST);
    }
  }

  async deposit({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.SmartVaultDeposit;
  }>): Promise<Public.UnsignedTransaction | Error> {
    const wallet: Public.WalletAccount = pick(body, [
      'walletAddress',
      'collateralUtxo',
      'walletRewardAddresses',
      'walletUsedAddresses',
      'walletUnusedAddresses',
    ]);

    if (user) {
      const data: Public.SmartVaultDepositData = pick(body, [
        'smartVaultId',
        'depositAssets',
      ]);

      return await this.prisma.$transaction(
        async prisma =>
          this.smartVaultApplication.smartVaultDeposit(
            prisma,
            user,
            wallet,
            data
          ),
        this.configService.getPrismaTransactionOptions()
      );
    } else {
      // Should never happen if `userIsPresentAuthorization` is a pre-handler on this route.
      throw new ApplicationError(ErrorCode.HTTP__USER_NOT_ATTACHED_TO_REQUEST);
    }
  }

  async withdraw({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.SmartVaultWithdraw;
  }>): Promise<Public.UnsignedTransaction | Error> {
    const wallet: Public.WalletAccount = pick(body, [
      'walletAddress',
      'collateralUtxo',
      'walletRewardAddresses',
      'walletUsedAddresses',
      'walletUnusedAddresses',
    ]);

    if (user) {
      const data: Public.SmartVaultWithdrawData = pick(body, [
        'smartVaultId',
        'withdrawAssets',
      ]);

      return await this.prisma.$transaction(
        async prisma =>
          this.smartVaultApplication.smartVaultWithdraw(
            prisma,
            user,
            wallet,
            data
          ),
        this.configService.getPrismaTransactionOptions()
      );
    } else {
      // Should never happen if `userIsPresentAuthorization` is a pre-handler on this route.
      throw new ApplicationError(ErrorCode.HTTP__USER_NOT_ATTACHED_TO_REQUEST);
    }
  }

  async withdrawEstimate({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.SmartVaultWithdraw;
  }>): Promise<Public.SmartVaultWithdrawEstimateResult | Error> {
    const wallet: Public.WalletAccount = pick(body, [
      'walletAddress',
      'collateralUtxo',
      'walletRewardAddresses',
      'walletUsedAddresses',
      'walletUnusedAddresses',
    ]);

    if (user) {
      const data: Public.SmartVaultWithdrawData = pick(body, [
        'smartVaultId',
        'withdrawAssets',
      ]);

      return await this.prisma.$transaction(
        async prisma =>
          this.smartVaultApplication.smartVaultWithdrawEstimate(
            prisma,
            user,
            wallet,
            data
          ),
        this.configService.getPrismaTransactionOptions()
      );
    } else {
      // Should never happen if `userIsPresentAuthorization` is a pre-handler on this route.
      throw new ApplicationError(ErrorCode.HTTP__USER_NOT_ATTACHED_TO_REQUEST);
    }
  }

  async close({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.SmartVaultClose;
  }>): Promise<Public.UnsignedTransaction | Error> {
    const wallet: Public.WalletAccount = pick(body, [
      'walletAddress',
      'collateralUtxo',
      'walletRewardAddresses',
      'walletUsedAddresses',
      'walletUnusedAddresses',
    ]);

    if (user) {
      const data: Public.SmartVaultCloseData = pick(body, ['smartVaultId']);

      return await this.prisma.$transaction(
        async prisma =>
          this.smartVaultApplication.smartVaultClose(
            prisma,
            user,
            wallet,
            data
          ),
        this.configService.getPrismaTransactionOptions()
      );
    } else {
      // Should never happen if `userIsPresentAuthorization` is a pre-handler on this route.
      throw new ApplicationError(ErrorCode.HTTP__USER_NOT_ATTACHED_TO_REQUEST);
    }
  }
}
