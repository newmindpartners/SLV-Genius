import {first} from 'lodash';

import * as Sentry from '@sentry/node';

import {sortDates, stringToDate} from '~/domain/utils/date.util';
import {snakeCase} from '~/domain/utils/string.util';

import * as Private from '~/domain/models/private';

import {AssertionError} from 'assert';
import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';

interface KycRequiredInformation {
  reviewDate: string;
  countryCode: string;
}

export interface KycValidationContext {
  countryCode?: string;
  reviewDate?: string;
  reviewResult?: string;
  reviewStatus?: string;
  documents?: Private.KycDocument[];
}

export interface KycValidationResult {
  isKycRequired: boolean;
  countryCode?: string;
  reviewDate?: string;
  reviewResult?: string;
  reviewStatus?: string;
  documentExpiryDate?: string;
}

const DISABLE_DOCUMENT_EXPIRATION_VALIDATION = true;

export const validateKyc = (
  kycData: Private.KycData,
  kycStatus: Private.KycStatus
): KycValidationResult => {
  const reviewResult = validateAndGetReviewResult(kycStatus);

  const reviewStatus = validateAndGetReviewStatus(kycStatus);

  const documentExpiryDate = DISABLE_DOCUMENT_EXPIRATION_VALIDATION
    ? new Date()
    : validateAndGetDocumentExpiryDate(kycData);

  const otherRequiredInformation = validateAndGetRequiredInformation(
    kycData,
    kycStatus
  );

  const isKycRequired = false;

  const validationResult: KycValidationResult = {
    isKycRequired,

    reviewStatus,
    reviewResult,

    ...otherRequiredInformation,

    documentExpiryDate: documentExpiryDate.toISOString(),
  };

  return validationResult;
};

function validateAndGetReviewStatus(
  kycStatus: Private.KycStatus
): string | undefined {
  const {reviewStatus} = kycStatus;
  const expectedReviewStatus = 'completed';
  assertEqual('reviewStatus', reviewStatus, expectedReviewStatus);
  return reviewStatus;
}

function validateAndGetReviewResult(
  kycStatus: Private.KycStatus
): string | undefined {
  const {reviewResult} = kycStatus;
  const expectedReviewResult = 'GREEN';
  assertEqual('reviewResult', reviewResult, expectedReviewResult);
  return reviewResult;
}

function validateAndGetRequiredInformation(
  kycData: Private.KycData,
  kycStatus: Private.KycStatus
): KycRequiredInformation {
  const {reviewDate} = kycStatus;
  const {countryCode} = kycData;
  assertNotNull('country', countryCode);
  assertNotNull('reviewDate', reviewDate);
  return {reviewDate, countryCode: countryCode!};
}

function validateAndGetDocumentExpiryDate(kycData: Private.KycData): Date {
  const {documents} = kycData;

  const documentExpiryDate = getSortedExpiryDate(documents);

  const firstDocumentExpiryDate = first(documentExpiryDate);
  if (!firstDocumentExpiryDate) {
    Sentry.setContext('Context', {
      functionScope: 'validateAndGetDocumentExpiryDate',
      kycData,
    });
    throw new ApplicationError(ErrorCode.KYC__INVALID_DOCUMENT);
  }

  const documentIsExpired = new Date() > firstDocumentExpiryDate;

  if (documentIsExpired) {
    Sentry.setContext('Context', {
      functionScope: 'validateAndGetDocumentExpiryDate',
      kycData,
    });
    throw new ApplicationError(ErrorCode.KYC__DOCUMENT_EXPIRED);
  }

  return firstDocumentExpiryDate;
}

function getSortedExpiryDate(documents: Private.KycDocument[]): Date[] {
  const expiryDates = documents
    .filter(({expiryDate}) => expiryDate)
    .map(({expiryDate}) => stringToDate(expiryDate))
    .filter(expiryDate => null !== expiryDate);
  return sortDates(expiryDates as Date[]);
}

function assertEqual<T>(key: string, value: T, expectedValue: T): void {
  if (value !== expectedValue) {
    error(key, value, 'NOT', `${expectedValue}`);
  }
}

function assertNotNull<T>(
  key: string,
  value: T | null,
  expectedValue: string | null = null
): void {
  if (!value) {
    error(key, value, 'NOT', expectedValue || 'NULL');
  }
}

function error<T>(key: string, value: T, ...args: string[]): void {
  const message = [
    snakeCase(key).toUpperCase(),
    ...args.map(s => s.toUpperCase()),
  ].join('_');
  throw new AssertionError({message});
}
