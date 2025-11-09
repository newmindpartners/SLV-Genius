// eslint-disable-next-line node/no-unpublished-import
import {createMock} from 'ts-auto-mock';
import {User} from '~/domain/models/private';

export const mockUser = (userInput: Partial<User>): User => ({
  ...createMock<User>({
    userId: '1',
    acceptedTermsVersion: '1.0.0',
    userKyc: {
      kycExternalId: '1',
      userId: '1',
      userKycId: '1',
      countryId: '1',
      kycProvider: 'SUMSUB',
      reviewResult: 'GREEN',
      reviewStatus: 'completed',
      isLatestKycValidResult: true,
    },
  }),
  ...userInput,
});
