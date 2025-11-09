import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import {inject, injectable, singleton} from 'tsyringe';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {KycService, TermsService} from '~/domain/services';

import {UserRepository} from '~/domain/repositories';

import {ApplicationError} from '~/application/application.error';
import {ErrorCode, PublicErrorCode} from '~/domain/errors/domain.error';

@singleton()
@injectable()
export class UserApplication {
  constructor(
    @inject('KycService')
    private readonly kycService: KycService,

    @inject('TermsService')
    private readonly termsService: TermsService,

    @inject('UserRepository')
    private readonly userRepository: UserRepository
  ) {}

  /**
   * get user when kyc has been completed, or create a new user with kyc access token to initiate kyc on client side
   *
   * @param context transactional context
   * @param connect contains attributes required for connecting a users wallet
   *
   * @return user with kyc access token and a reject reason that explain why this user have to initiate a kyc request
   */
  async userConnectGetUserOrCreate(
    context: TransactionalContext,
    connect: Public.UserConnect
  ): Promise<Public.UserConnectResponse> {
    const user = await this.userRepository.getOrCreateUserWithStakeKeyHash(
      context,
      connect.walletStakeKeyHash,
      connect.userType,
      connect.walletType
    );

    return await this.validateUser(context, connect, user);
  }

  private async validateUser(
    context: TransactionalContext,
    connect: Public.UserConnect,
    user: Private.User | null
  ): Promise<Public.UserConnectResponse> {
    const terms = this.validateUserTermsAndCondition(user);

    const kyc = await this.validateUserKycAndSave(
      context,
      connect.walletStakeKeyHash,
      user
    );

    return {
      ...user,
      ...kyc,
      ...terms,
    };
  }

  /**
   * create or update an user with event received from external kyc provider, and apply kyc to that user
   *
   * @param context transactional context
   * @param event an external event that include kyc status update
   *
   * @return user with referenced kyc applicant id or external user id
   */
  async userUpdateWithEvent(
    context: TransactionalContext,
    event: Private.KycEvent
  ): Promise<Private.User> {
    return await this.createOrUpdateUserWithEvent(context, event);
  }

  /**
   * update user terms acceptance version
   *
   * @param context transactional context
   * @param user user internal object
   * @param userTerms user accepted terms version and userId
   *
   * @return void
   */
  async userUpdateWithTerms(
    context: TransactionalContext,
    user: Private.User,
    userTerms: Public.TermsAccept
  ): Promise<void> {
    const {acceptedTermsVersion} = userTerms;

    const validatedUserTerms =
      this.termsService.getLatestUserTerms(acceptedTermsVersion);

    const {isTermsAcceptanceRequired} = validatedUserTerms;

    if (isTermsAcceptanceRequired) {
      const {termsVersion} = validatedUserTerms;
      throw new ApplicationError(
        ErrorCode.INVALID_TERMS__VERSION_MISMATCH,
        `expected termsVersion is >${termsVersion}< ` +
          `actual acceptedTermsVersion is >${acceptedTermsVersion}<`
      );
    }

    await this.userRepository.userUpdateWithTerms(context, user, userTerms);
  }

  private async validateUserKycAndSave(
    context: TransactionalContext,
    walletStakeKeyHash: string,
    user: Private.User | null
  ): Promise<Public.UserKyc> {
    if (user) {
      const validationResult = await this.kycService.validateUser(
        user,
        walletStakeKeyHash
      );

      await this.userRepository.createOrUpdateUser(
        context,
        user,
        validationResult
      );

      return validationResult;
    } else {
      return {
        isKycRequired: true,
        isKycRequiredReason: PublicErrorCode.USER_CONNECT__INVALID_USER,
      };
    }
  }

  private validateUserTermsAndCondition(
    user: Private.User | null
  ): Public.UserTerms {
    const terms = this.termsService.getLatestUserTerms(
      user?.acceptedTermsVersion
    );

    return terms;
  }

  private async createOrUpdateUserWithEvent(
    context: TransactionalContext,
    event: Private.KycEvent
  ): Promise<Private.User> {
    return await this.userRepository.updateUserWithEvent(context, event);
  }
}
