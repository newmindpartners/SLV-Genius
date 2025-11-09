import {inject, injectable, singleton} from 'tsyringe';

import {PrismaClient} from '@prisma/client';

import * as Private from '~/domain/models/private';

import {ConfigService} from '~/domain/services';

import AbstractHook from '~/implementation/fastify/hook/abstract';

import {UserRepository} from '~/domain/repositories';

import {FastifyRequest} from 'fastify';

// https://cips.cardano.org/cips/cip19/
export enum WalletStakeKeyHashFormatHeaderPrefix {
  HEX = 'WalletStakeKeyHash ',
}

// https://security.stackexchange.com/questions/108662/why-is-bearer-required-before-the-token-in-authorization-header-in-a-http-re
const getWalletStakeKeyHash = (
  req: FastifyRequest,
  prefix: WalletStakeKeyHashFormatHeaderPrefix
) => {
  const authorizationHeader = req.headers['authorization'];
  const stakeKeyHash = authorizationHeader?.replace(prefix, '');
  return stakeKeyHash;
};

@singleton()
@injectable()
export class UserHook implements AbstractHook {
  constructor(
    @inject('PrismaClient') private readonly prismaClient: PrismaClient,
    @inject('ConfigService') private readonly configService: ConfigService,
    @inject('UserRepository') private readonly userRepository: UserRepository
  ) {}

  handler = async (req: FastifyRequest) => {
    // get wallet address from header if present
    const stakeKeyHash = getWalletStakeKeyHash(
      req,
      WalletStakeKeyHashFormatHeaderPrefix.HEX
    );

    // get user from wallet address at attach to request
    req.user = stakeKeyHash ? await this.getUser(stakeKeyHash) : null;
  };

  getUser = async (stakeKeyHash: string): Promise<Private.User | null> =>
    await this.userRepository.getUserByStakeKeyHash(
      this.prismaClient,
      stakeKeyHash
    );
}
