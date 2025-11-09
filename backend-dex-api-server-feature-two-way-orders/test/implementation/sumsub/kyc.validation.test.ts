import {randomUUID} from 'crypto';

import {KycData} from '~/domain/models/private';
import {KycStatus} from '~/domain/models/private';
import {KycProvider} from '~/domain/models/private';

import {validateKyc} from '~/implementation/kyc/sumsub/kyc.validation';
import {KycValidationContext} from '~/implementation/kyc/sumsub/kyc.validation';

const now = new Date();

const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

const validDocument = {expiryDate: tomorrow.toISOString()};
// const expiredDocument = {expiryDate: now.toISOString()};

const validKyc: KycValidationContext = {
  countryCode: 'CHE',
  reviewResult: 'GREEN',
  reviewStatus: 'completed',
  reviewDate: now.toISOString(),
  documents: [validDocument],
};

test('country NULL', () => {
  validateKycExpect(
    'COUNTRY_NOT_NULL',
    invalidKyc({countryCode: undefined}),
    now
  );
});

test('review result RED', () => {
  validateKycExpect(
    'REVIEW_RESULT_NOT_GREEN',
    invalidKyc({reviewResult: undefined}),
    now
  );
});

test('review status NOT completed', () => {
  validateKycExpect(
    'REVIEW_STATUS_NOT_COMPLETED',
    invalidKyc({reviewStatus: undefined}),
    now
  );
});

// test('document expiry date NULL', () => {
//   validateKycExpect('KYC__INVALID_DOCUMENT', invalidKyc({documents: []}), now);
// });

// test('document expiry date GT now', () => {
//   validateKycExpect(
//     'KYC__DOCUMENT_EXPIRED',
//     invalidKyc({documents: [expiredDocument]}),
//     now
//   );
// });

function validateKycExpect(
  errorCode: string,
  withInput: KycValidationContext,
  now: Date = new Date()
): void {
  const {
    reviewDate = now.toISOString(),
    reviewResult,
    reviewStatus,
    countryCode,
    documents = [],
  } = withInput;

  const kycExternalId = randomUUID();
  const kycProvider = KycProvider.SUMSUB;

  const kycData: KycData = {
    kycProvider,
    kycExternalId,
    documents,
    countryCode,
  };

  const kycStatus: KycStatus = {
    reviewDate,
    reviewResult,
    reviewStatus,
    createDate: now.toISOString(),
  };

  try {
    validateKyc(kycData, kycStatus);
    fail();
  } catch (expectedError) {
    if (expectedError instanceof Error) {
      expect(expectedError.message).toBe(errorCode);
    }
  }
}

const invalidKyc = (invalidKyc: KycValidationContext): KycValidationContext => {
  return {...validKyc, ...invalidKyc};
};
