import {UserKyc} from '~/domain/models/public';

import {KycValidationResult} from '~/implementation/kyc/sumsub/kyc.validation';

export type UserValidationResult = UserKyc &
  KycValidationResult & {
    userId: string;

    kycProvider: string;
    kycExternalId?: string;
  };
