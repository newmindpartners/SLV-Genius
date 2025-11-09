import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {YieldFarmingApplication} from '~/application/yieldFarming.application';

import {ConfigService} from '~/domain/services';

import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';

import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';
import {YieldFarmingRewardsClaim} from '~/domain/models/public';

@singleton()
export class YieldFarmingMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService')
    configService: ConfigService,

    @inject(YieldFarmingApplication)
    private readonly yieldFarmingApplication: YieldFarmingApplication
  ) {
    super(configService);
  }

  async rewardsClaim({
    user,
    body,
  }: FastifyRequest<{
    Body: Public.YieldFarmingRewardsClaim;
  }>): Promise<Public.UnsignedTransaction> {
    const {
      walletAddress,
      collateralUtxo,
      walletRewardAddresses,
      walletUsedAddresses,
      walletUnusedAddresses,
    } = body;

    const wallet: Public.WalletAccount = {
      walletAddress,
      collateralUtxo,
      walletUsedAddresses,
      walletUnusedAddresses,
      walletRewardAddresses,
    };

    if (user) {
      return await this.yieldFarmingApplication.rewardsClaim(user, wallet);
    } else {
      throw new ApplicationError(
        ErrorCode.YIELD_FARMING__USER_NOT_ATTACHED_TO_REQUEST
      );
    }
  }
}
