import {FastifyRequest} from 'fastify';
import {PrismaClient} from '@prisma/client';
import {inject, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';

import {ConfigService} from '~/domain/services';

import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';
import {TradingWalletApplication} from '~/application/tradingWallet.application';
import {ApplicationError} from '~/application/application.error';
import {ErrorCode} from '~/domain/errors';

@singleton()
export class TradingWalletMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject('PrismaClient')
    private readonly prisma: PrismaClient,

    @inject('TradingWalletApplication')
    private readonly tradingWalletApplication: TradingWalletApplication
  ) {
    super(configService);
  }

  async registerTradingWallet({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.RegisterTradingWallet;
  }>): Promise<Public.TradingWalletRegisterResult> {
    if (user) {
      return await this.prisma.$transaction(async prisma =>
        this.tradingWalletApplication.registerTradingWallet(
          prisma,
          body,
          user.walletStakeKeyHash
        )
      );
    } else {
      throw new ApplicationError(
        ErrorCode.TRADING_WALLET__USER_NOT_ATTACHED_TO_REQUEST
      );
    }
  }
}
