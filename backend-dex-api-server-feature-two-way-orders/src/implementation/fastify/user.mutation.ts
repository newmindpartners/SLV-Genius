import {FastifyRequest} from 'fastify';

import {inject, singleton} from 'tsyringe';

import {
  KycSumsubEvent,
  TermsAccept,
  UserConnect,
  UserConnectResponse,
} from '~/domain/models/public';

import * as Private from '~/domain/models/private';

import {UserApplication} from '~/application/user.application';

import {ErrorCode} from '~/domain/errors/domain.error';
import {ApplicationError} from '~/application/application.error';

import {PrismaClient} from '@prisma/client';

import {ConfigService} from '~/domain/services';

import {AbstractMutation} from '~/implementation/fastify/abstract.mutation';

@singleton()
export class UserMutationFastify extends AbstractMutation {
  constructor(
    @inject('ConfigService') configService: ConfigService,
    @inject('PrismaClient') private readonly prisma: PrismaClient,
    @inject(UserApplication) private readonly userApplication: UserApplication
  ) {
    super(configService);
  }

  async postUserConnect(
    req: FastifyRequest<{Body: UserConnect}>
  ): Promise<UserConnectResponse> {
    return await this.prisma.$transaction(
      async prisma =>
        await this.userApplication.userConnectGetUserOrCreate(prisma, req.body),
      this.configService.getPrismaTransactionOptions()
    );
  }

  async postUserKycEvent(
    req: FastifyRequest<{Body: KycSumsubEvent; Params: {provider: string}}>
  ): Promise<Private.User> {
    return this.prisma.$transaction(
      async prisma =>
        this.userApplication.userUpdateWithEvent(
          prisma,
          this.toKycEvent(req.params.provider, req.body)
        ),
      this.configService.getPrismaTransactionOptions()
    );
  }

  async postTermsAccept(
    req: FastifyRequest<{Body: TermsAccept}>
  ): Promise<void> {
    return this.prisma.$transaction(
      async prisma =>
        await this.userApplication.userUpdateWithTerms(
          prisma,
          req.user!,
          req.body
        ),
      this.configService.getPrismaTransactionOptions()
    );
  }

  private toKycEvent(
    provider: string,
    event: KycSumsubEvent
  ): Private.KycEvent {
    return <Private.KycEvent>{event, provider: this.getKycProvider(provider)};
  }

  private getKycProvider(provider: string): Private.KycProvider {
    if ('sumsub' === provider) return Private.KycProvider.SUMSUB;
    throw new ApplicationError(ErrorCode.KYC__PROVIDER_INVALID);
  }
}
