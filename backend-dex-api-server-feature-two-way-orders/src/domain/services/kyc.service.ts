import * as Private from '~/domain/models/private';

export interface KycService {
  /**
   * consume kyc endpoint to retrieve applicant information and status, and perform business validation accordingly
   *
   * @param user user id
   * @param walletStakeKeyHash walletStakeKeyHash the stake part of a Shelley address
   *
   * @return a kyc user or an userReferenc with a reject reason that explain why that userReference is not valid
   */
  validateUser(
    user: Private.User,
    walletStakeKeyHash: string
  ): Promise<Private.UserValidationResult>;
}
