import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import * as Sentry from '@sentry/react';
import {
  ApiGeneralError,
  ApiOrderError,
  unknownNetworkErrorToApiError,
} from '~/redux/api/error';
import {
  TransactionError,
  TransactionErrorCode,
  TransactionRequestError,
} from '~/redux/saga/transaction/utils';
import { WalletError, WalletErrorCode } from '~/types/wallet';

import { apiErrorToMessage } from './stringUtils';

export const parseApiErrorToMessage = (error: FetchBaseQueryError | SerializedError) => {
  const defaultErrorMessage = 'An error has occurred, please try again later';
  const apiError = unknownNetworkErrorToApiError(error);

  return apiError ? apiErrorToMessage(apiError) : defaultErrorMessage;
};

export type UIKitError = TransactionRequestError;

/**
 * Decide which errors should be reported to Sentry.
 * It should be errors which are unexpected and we should be concerned with.
 * We should not send errors related to user configuration issues, such as no collateral set.
 */
export const handleSentryReporting = (error: UIKitError): void => {
  Sentry.setContext('Context', {
    functionScope: 'handleSentryReporting',
    error,
  });

  if (error instanceof ApiGeneralError || error instanceof ApiOrderError) {
    // Leave this reporting to API server
  } else if (error instanceof TransactionError) {
    switch (error.errorCode) {
      case TransactionErrorCode.FAILED_RESPONSE_VALIDATION:
      case TransactionErrorCode.UNKNOWN_TRANSACTION_ERROR:
      case TransactionErrorCode.INVALID_REQUEST_PAYLOAD:
        Sentry.captureEvent(error);
    }
  } else if (error instanceof WalletError) {
    switch (error.errorCode) {
      case WalletErrorCode.FUNCTION_NOT_IMPLEMENTED:
      case WalletErrorCode.INVALID_OR_MISSING_STAKE_KEY_HASH:
      case WalletErrorCode.WALLET_GLOBAL_NOT_FOUND:
      case WalletErrorCode.WALLET_ACCOUNT_NOT_FOUND:
      case WalletErrorCode.WALLET_TYPES_NOT_FOUND:
      case WalletErrorCode.WALLET_PROVIDER_NOT_FOUND:
        Sentry.captureEvent(error);
    }
  } else {
    Sentry.captureEvent(error);
  }
};
