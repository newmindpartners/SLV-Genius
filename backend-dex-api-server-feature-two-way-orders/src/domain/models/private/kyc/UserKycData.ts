import {KycProvider, KycStatus} from '~/domain/models/private';

export type KycReviewStatus = Partial<
  Pick<KycStatus, 'reviewDate' | 'reviewResult' | 'reviewStatus'>
>;

export type UserKycReference = {
  userKycId: string;
};

export type UserKycData = UserKycReference &
  KycReviewStatus & {
    kycExternalId: string;
    kycProvider: KycProvider;
    countryCode?: string;
    documentExpiryDate?: string;
    isKycRequiredReason?: string;
  };
