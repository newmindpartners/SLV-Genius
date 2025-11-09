import {KycService} from '~/domain/services';

import * as Private from '~/domain/models/private';

export class KycServiceMock implements KycService {
  kycProvider = Private.KycProvider.MOCK;

  async validateUser(
    user: Private.User
  ): Promise<Private.UserValidationResult> {
    const {kycProvider} = this;

    const {userId} = user;

    const validationResult: Private.UserValidationResult = {
      userId,
      countryCode: 'CHE',
      kycProvider,
      isKycRequired: false,
      isKycRequiredReason: undefined,
    };

    return validationResult;
  }
}
