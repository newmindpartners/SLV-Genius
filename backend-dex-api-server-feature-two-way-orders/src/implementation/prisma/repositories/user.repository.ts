import {inject, injectable, singleton} from 'tsyringe';

import * as Sentry from '@sentry/node';

import {TransactionalContext} from '~/domain/context';

import {Hex} from '~/domain/models/cardano';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';
import {KycReviewResult, Prisma} from '@prisma/client';

import {UserRepository} from '~/domain/repositories';

import {DomainMapper} from '~/implementation/prisma/domain.mapper';

import {ErrorCode} from '~/domain/errors/domain.error';
import {PersistenceError} from '~/implementation/prisma/persistence.error';

@singleton()
@injectable()
export class UserRepositoryPrisma implements UserRepository {
  constructor(
    @inject('DomainMapper') private readonly domainMapper: DomainMapper
  ) {}

  async createOrUpdateUser(
    prisma: Prisma.TransactionClient,
    user: Private.User,
    userValidation: Private.UserValidationResult
  ): Promise<Private.User> {
    const {userId} = user;

    const {kycExternalId, kycProvider} = userValidation;

    const {
      countryCode,
      reviewDate,
      reviewResult,
      reviewStatus,
      isKycRequired,
      isKycRequiredReason,
      documentExpiryDate,
    } = userValidation;

    const where = {userId};

    const country = countryCode
      ? {connectOrCreate: {where: {countryCode}, create: {countryCode}}}
      : undefined;

    const isReviewResultGreen = 'GREEN' === reviewResult;

    const updateReviewResult = isReviewResultGreen
      ? KycReviewResult.GREEN
      : KycReviewResult.RED;

    const updateReviewDate = reviewDate ? new Date(reviewDate) : reviewDate;

    const updateDocumentExpiryDate = new Date(
      documentExpiryDate || new Date().toISOString()
    );

    const updateRejectReason =
      undefined === isKycRequiredReason ? null : isKycRequiredReason; // this is to update this attribute to null, undefined is ignored by prisma

    const updateIsLatestKycValidResult = !isKycRequired;

    const create = {
      kycProvider,
      kycExternalId,
      country,
      reviewStatus,
      rejectReason: updateRejectReason,
      reviewDate: updateReviewDate,
      reviewResult: updateReviewResult,
      isLatestKycValidResult: updateIsLatestKycValidResult,
      documentExpiryDate: updateDocumentExpiryDate,
      latestKycValidationDate: new Date(),
    };

    const update = {...create};

    const data: Prisma.UserUpdateInput = {
      userId,
      userKyc: {
        upsert: {
          update,
          create,
        },
      },
    };

    const updatedUser = await prisma.user.update({
      where,
      data,
      include: {userKyc: true},
    });

    return updatedUser;
  }

  async updateUserWithEvent(
    prisma: Prisma.TransactionClient,
    rawEvent: Private.KycEvent
  ): Promise<Private.User> {
    if (Private.KycProvider.SUMSUB === rawEvent.provider)
      return await this.updateUserWithEventSumsub(prisma, rawEvent.event);
    throw new PersistenceError(ErrorCode.KYC__PROVIDER_INVALID);
  }

  async updateUserWithEventSumsub(
    prisma: Prisma.TransactionClient,
    event: Public.KycSumsubEvent
  ): Promise<Private.User> {
    const {
      levelName,
      reviewStatus,
      applicantId: kycExternalId,
      externalUserId: userId,
      reviewResult: sumsubReviewResult,
    } = event;

    const {reviewAnswer: reviewResult} = sumsubReviewResult || {};

    const isReviewResultGreen = 'GREEN' === reviewResult;

    const updateReviewResult = isReviewResultGreen
      ? KycReviewResult.GREEN
      : KycReviewResult.RED;

    const kycEvent: Prisma.KycEventUncheckedCreateWithoutUserKycEventInput = {
      kycExternalId,
      userId,
      levelName,
      reviewStatus,
      reviewResult: updateReviewResult,
    };

    const user = {userId: kycEvent.userId};

    const updateRejectReason = isReviewResultGreen ? null : undefined;

    const userKyc: Prisma.UserKycUpdateWithoutUserInput = {
      kycExternalId,
      reviewStatus,
      rejectReason: updateRejectReason,
      reviewResult: updateReviewResult,
      kycEvent: {create: kycEvent},
    };

    try {
      const updatedUser = await prisma.user.update({
        where: user,
        data: {
          userId,
          userKyc: {
            update: userKyc,
          },
        },
        include: {userKyc: true},
      });

      return updatedUser;
    } catch (e) {
      Sentry.setContext('Context', {
        functionScope: 'updateUserWithEventSumsub',
        event,
        user,
        userKyc,
      });
      throw e;
    }
  }

  async getOrCreateUserWithStakeKeyHash(
    context: TransactionalContext,
    walletStakeKeyHash: string,
    userType: Public.UserType = Private.UserType.INDIVIDUAL,
    walletType?: string
  ): Promise<Private.User> {
    return await this.upsertUserWithStakeKeyHash(
      context,
      walletStakeKeyHash,
      userType,
      walletType
    );
  }

  async getUserByStakeKeyHash(
    prisma: Prisma.TransactionClient,
    walletStakeKeyHash: Hex
  ): Promise<Private.User | null> {
    const user = await prisma.user.findUnique({
      where: {walletStakeKeyHash},
      include: {userKyc: true},
    });

    return user;
  }

  private async upsertUserWithStakeKeyHash(
    prisma: Prisma.TransactionClient,
    walletStakeKeyHash: string,
    userType: Public.UserType,
    walletType?: string
  ): Promise<Private.User> {
    const create: Prisma.UserCreateInput = {
      walletStakeKeyHash,
      userType,
      walletConnectEvent: {
        /**
         * When users are created through means other than the `/user/connect` event,
         * we do not know the wallet type to associate with the connection event.
         * Tracking the fact that we don't know may be of use for us when debugging.
         */
        create: {walletType: walletType || 'UNKNOWN_WALLET_TYPE'},
      },
    };
    const update = create;

    const user = await prisma.user.upsert({
      create,
      update,
      where: {walletStakeKeyHash},
      include: {userKyc: true},
    });

    return user;
  }

  async userUpdateWithTerms(
    prisma: Prisma.TransactionClient,
    user: Private.User,
    terms: Public.TermsAccept
  ): Promise<Private.User> {
    const acceptedTermsDate = new Date();

    const {userId} = user;
    const {acceptedTermsVersion} = terms;

    const data = {acceptedTermsVersion, acceptedTermsDate};

    const savedUser = await prisma.user.update({
      data,
      where: {userId},
      include: {userKyc: true},
    });

    return savedUser;
  }

  async getUserByUserId(
    prisma: Prisma.TransactionClient,
    userId: string
  ): Promise<Private.User> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {userId},
      include: {userKyc: true},
    });

    return user;
  }
}
