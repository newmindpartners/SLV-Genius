import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import {TermsAccept, UserType} from '~/domain/models/public';

import * as Private from '~/domain/models/private';
import {Hex} from '../models/cardano';

export interface UserRepository {
  /**
   * update an user and add an event received from external kyc provider
   *
   * @param context transactional context
   * @param event an external event that include kyc status update
   *
   * @return user with referenced kyc applicant id or external user id
   */
  updateUserWithEvent(
    context: TransactionalContext,
    event: Private.KycEvent
  ): Promise<Private.User>;

  /**
   * create or update an user, this entity contains specific information about user with kyc validation (eg result, review, etc)
   *
   * @param context transactional context
   * @param userKyc user with kyc information
   * @param userValidationResult result of user validation
   *
   * @return created or updated user
   */
  createOrUpdateUser(
    context: TransactionalContext,
    userKyc: Private.User,
    userValidationResult: Private.UserValidationResult
  ): Promise<Private.User>;

  getOrCreateUserWithStakeKeyHash(
    context: TransactionalContext,
    walletStakeKeyHash: Hex,
    userType?: UserType,
    walletType?: string
  ): Promise<Private.User>;

  /**
   * get an user with a specific wallet address
   *
   * @param context transactional context
   * @param stakeKeyHash the stake part of a Shelley address
   *
   * @return user with that wallet
   */
  getUserByStakeKeyHash(
    context: TransactionalContext,
    stakeKeyHash: string
  ): Promise<Private.User | null>;

  /**
   * update user terms version
   *
   * @param prisma transactional context
   * @param userReference user reference
   * @param terms accepted terms object
   *
   * @return user updated
   */
  userUpdateWithTerms(
    prisma: TransactionalContext,
    userReference: Private.User,
    terms: TermsAccept
  ): Promise<Private.User>;

  getUserByUserId(
    prisma: TransactionalContext,
    userId: string
  ): Promise<Private.User>;
}
