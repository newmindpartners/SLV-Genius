import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import {
  AbstractError,
  GeneralError,
  NetworkErrorCode,
  OrderErrorCode,
  StakeVaultErrorCode,
  TradingWalletErrorCode,
  TransactionErrorCode,
} from '~/redux/api/core';

export class ApiGeneralError extends Error {
  constructor(
    readonly errorCode: GeneralError['errorCode'],
    message: string | null = null,
  ) {
    super(message || errorCode);
  }
}

enum ApiGeneralErrorCode {
  UNEXPECTED_ERROR_RESPONSE = 'UNEXPECTED_ERROR_RESPONSE',
}

type SharedErrorCode = TransactionErrorCode | NetworkErrorCode;

export class ApiSharedError extends Error {
  constructor(readonly errorCode: SharedErrorCode, message: string | null = null) {
    super(message || errorCode);
  }
}

export class ApiOrderError extends Error {
  constructor(readonly errorCode: OrderErrorCode, message: string | null = null) {
    super(message || errorCode);
  }
}

export class ApiStakeVaultError extends Error {
  constructor(readonly errorCode: StakeVaultErrorCode, message: string | null = null) {
    super(message || errorCode);
  }
}

export class ApiTradingWalletError extends Error {
  constructor(readonly errorCode: TradingWalletErrorCode, message: string | null = null) {
    super(message || errorCode);
  }
}

export type ApiError =
  | ApiOrderError
  | ApiGeneralError
  | ApiStakeVaultError
  | ApiSharedError;

export const ApiSharedErrorCode: {
  [key in SharedErrorCode]: key;
} = {
  TRANSACTION__NO_SUITABLE_COLLATERAL: 'TRANSACTION__NO_SUITABLE_COLLATERAL',
  NETWORK__TIMEOUT: 'NETWORK__TIMEOUT',
};

export const isSharedError = (errorCode: string): errorCode is SharedErrorCode =>
  (Object.values(ApiSharedErrorCode) as string[]).includes(errorCode);

export const ApiOrderErrorCode: {
  [key in OrderErrorCode]: key;
} = {
  ORDER__BEST_AVAILABLE_ORDER_NOT_FOUND: 'ORDER__BEST_AVAILABLE_ORDER_NOT_FOUND',
  INVALID_ORDER__ORDER_NOT_ACTIVE_OR_EXPIRED:
    'INVALID_ORDER__ORDER_NOT_ACTIVE_OR_EXPIRED',
  INVALID_ORDER__INSUFFICIENT_BALANCE: 'INVALID_ORDER__INSUFFICIENT_BALANCE',
  INVALID_ORDER__UTXO_CONSUMED: 'INVALID_ORDER__UTXO_CONSUMED',
};

export const isOrderError = (errorCode: string): errorCode is OrderErrorCode => {
  const orderErrorCodes: string[] = Object.values(ApiOrderErrorCode);
  return orderErrorCodes.includes(errorCode);
};

export const ApiStakeVaultErrorCode: {
  [key in StakeVaultErrorCode]: key;
} = {
  INVALID_STAKE_VAULT__NFT_COMBINATION: 'INVALID_STAKE_VAULT__NFT_COMBINATION',
  INVALID_STAKE_VAULT__VESTING_NFTS_NOT_ALLOWED:
    'INVALID_STAKE_VAULT__VESTING_NFTS_NOT_ALLOWED',
  INVALID_STAKE_VAULT__INSUFFICIENT_BALANCE: 'INVALID_STAKE_VAULT__INSUFFICIENT_BALANCE',
  INVALID_STAKE_VAULT__WALLET_ADDRESS_MISSING_STAKE_PART:
    'INVALID_STAKE_VAULT__WALLET_ADDRESS_MISSING_STAKE_PART',
  INVALID_STAKE_VAULT__INVALID_LOCK_DURATION:
    'INVALID_STAKE_VAULT__INVALID_LOCK_DURATION',
  INVALID_STAKE_VAULT__STAKED_ASSET_TOTAL_AMOUNT_LIMIT_REACHED:
    'INVALID_STAKE_VAULT__STAKED_ASSET_TOTAL_AMOUNT_LIMIT_REACHED',
  INVALID_STAKE_VAULT__STAKED_ASSET_AMOUNT_NOT_NUMBER:
    'INVALID_STAKE_VAULT__STAKED_ASSET_AMOUNT_NOT_NUMBER',
};

export const isStakeVaultError = (
  errorCode: string,
): errorCode is StakeVaultErrorCode => {
  const stakeVaultErrorCodes: string[] = Object.values(ApiStakeVaultErrorCode);
  return stakeVaultErrorCodes.includes(errorCode);
};

export const ApiTradingWalletErrorCode: {
  [key in TradingWalletErrorCode]: key;
} = {
  INVALID_TRADING_WALLET__INCORRECT_STAKE_KEY_HASH_FORMAT:
    'INVALID_TRADING_WALLET__INCORRECT_STAKE_KEY_HASH_FORMAT',
  INVALID_TRADING_WALLET__ALREADY_EXISTS: 'INVALID_TRADING_WALLET__ALREADY_EXISTS',
};

export const isTradingWalletError = (
  errorCode: string,
): errorCode is TradingWalletErrorCode =>
  (Object.values(ApiTradingWalletErrorCode) as string[]).includes(errorCode);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAbstractError = (error: any): error is AbstractError =>
  'errorCode' in error && typeof error.errorCode === 'string';

const isFetchBaseQueryError = (
  error: FetchBaseQueryError | SerializedError,
): error is FetchBaseQueryError => 'data' in error && 'status' in error;

const parseUnknownErrorToAbstractError = (
  error: FetchBaseQueryError | SerializedError,
): AbstractError | null =>
  isFetchBaseQueryError(error) && isAbstractError(error.data) ? error.data : null;

/**
 * This function validates incoming errors returned from the API server and converts them into
 * one of several more specific errors.
 *
 * The purpose of this is to provide the client with a set of errors to handle rather than one
 * generic error.
 *
 * The main benefit of this is to provide an `errorCode` which is a union of strings. The client
 * can then map these defined error codes to suitable messages for the end user.
 */
export const unknownNetworkErrorToApiError = (
  error: FetchBaseQueryError | SerializedError,
):
  | ApiOrderError
  | ApiStakeVaultError
  | ApiTradingWalletError
  | ApiGeneralError
  | ApiSharedError => {
  const abstractError = parseUnknownErrorToAbstractError(error);
  if (abstractError) {
    if (isSharedError(abstractError.errorCode)) {
      return new ApiSharedError(abstractError.errorCode, abstractError.message);
    } else if (isOrderError(abstractError.errorCode)) {
      return new ApiOrderError(abstractError.errorCode, abstractError.message);
    } else if (isStakeVaultError(abstractError.errorCode)) {
      return new ApiStakeVaultError(abstractError.errorCode, abstractError.message);
    } else if (isTradingWalletError(abstractError.errorCode)) {
      return new ApiTradingWalletError(abstractError.errorCode, abstractError.message);
    } else {
      return new ApiGeneralError(abstractError.errorCode, abstractError.message);
    }
  } else {
    const readableError = JSON.stringify(error);

    return new ApiGeneralError(
      ApiGeneralErrorCode.UNEXPECTED_ERROR_RESPONSE,
      `Expected error returned from API server to contain 'errorCode'.`.concat(
        `Error: ${readableError}`,
      ),
    );
  }
};

export enum ErrorCode {
  WALLET__WALLET_NOT_FOUND = 'WALLET__WALLET_NOT_FOUND',
  WALLET__CARDANO_NOT_FOUND = 'WALLET__CARDANO_NOT_FOUND',

  WALLET__INVALID_OR_MISSING_STAKE_KEY_HASH = 'WALLET__INVALID_OR_MISSING_STAKE_KEY_HASH',

  KYC__INVALID_OR_MISSING_KYC = 'KYC__INVALID_OR_MISSING_KYC',
  KYC__CONNECTED_WALLET_REQUIRED = 'KYC__CONNECTED_WALLET_REQUIRED',
}

export class KycError extends Error {
  constructor(errorCode: ErrorCode, private readonly debugMessage?: string) {
    super(errorCode);
  }
}

export class KycWalletError extends KycError {
  constructor(errorCode: ErrorCode, debugMessage?: string) {
    super(errorCode, debugMessage);
  }
}
