import 'reflect-metadata';

import {inject, injectable, singleton} from 'tsyringe';

import {optional} from '~/domain/utils/object.util';

import * as Private from '~/domain/models/private';

import {ConfigService, KycService} from '~/domain/services';

import {
  KycValidationResult,
  validateKyc,
} from '~/implementation/kyc/sumsub/kyc.validation';

import {SumsubClient} from '~/implementation/kyc/sumsub/sumsub.client';

import {AssertionError} from 'assert';
import {ErrorCode} from '~/domain/errors/domain.error';

@singleton()
@injectable()
export class KycServiceSumsub implements KycService {
  private kycProvider = Private.KycProvider.SUMSUB;

  constructor(
    @inject('ConfigService')
    private readonly configService: ConfigService,

    @inject('SumsubClient')
    private readonly sumsubClient: SumsubClient
  ) {}

  async validateUser(
    user: Private.User
  ): Promise<Private.UserValidationResult> {
    const {kycProvider} = this;

    const {userId} = user;

    try {
      await this.createExternalUserIfNotExists(user);

      const kycData = await this.getKycData(userId);
      const kycStatus = await this.getKycStatus(kycData);

      const {kycExternalId} = kycData;

      const kycValidationResult = validateKyc(kycData, kycStatus);

      const kycAccessToken = await this.createAccessTokenIfRequired(
        user,
        kycValidationResult
      );

      const validationResult: Private.UserValidationResult = {
        ...kycValidationResult,

        userId,

        kycExternalId,
        kycProvider,

        ...optional({kycAccessToken}),
      };

      return validationResult;
    } catch (e) {
      if (e instanceof AssertionError) {
        const {message: isKycRequiredReason} = e;
        return await this.requiredKyc(user, isKycRequiredReason);
      } else {
        throw e;
      }
    }
  }

  private async requiredKyc(
    user: Private.User,
    isKycRequiredReason: string
  ): Promise<Private.UserValidationResult> {
    const {userId} = user;
    const {kycProvider} = this;

    const isKycRequired = true;

    const kycAccessToken =
      (await this.createAccessTokenIfRequired(user, {isKycRequired})) ||
      undefined;

    const userValidationResult: Private.UserValidationResult = {
      userId,
      kycProvider,
      kycAccessToken,
      isKycRequired,
      isKycRequiredReason,
    };

    return userValidationResult;
  }

  private async createAccessTokenIfRequired(
    user: Private.User,
    result: KycValidationResult
  ): Promise<string | null> {
    const {isKycRequired} = result;

    if (isKycRequired) {
      return await this.createAccessToken(user);
    } else {
      return null;
    }
  }

  private async createAccessToken(user: Private.User): Promise<string> {
    const {userId, userType} = user;

    const levelName = this.configService.getSumsubLevelName(userType);

    return await this.sumsubClient.createAccessToken(userId, levelName);
  }

  private async createExternalUserIfNotExists(user: Private.User) {
    const {userId, userType} = user;

    const levelName = this.configService.getSumsubLevelName(userType);

    await this.sumsubClient.createApplicantIfNotExistsByUserId(
      userId,
      levelName
    );
  }

  private async getKycData(userId: string): Promise<Private.KycData> {
    const kycData = await this.sumsubClient.getApplicantByUserId(userId);
    if (null === kycData)
      throw new AssertionError({message: ErrorCode.KYC__DATA_NOT_FOUND});
    return kycData;
  }

  private async getKycStatus(
    kycReference: Private.KycReference
  ): Promise<Private.KycStatus> {
    const {kycExternalId} = kycReference;
    return await this.sumsubClient.getApplicantStatus(kycExternalId);
  }
}
