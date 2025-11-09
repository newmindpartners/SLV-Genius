import {
  ApiError,
  ApiGeneralError,
  ApiOrderError,
  ApiOrderErrorCode,
  ApiSharedError,
  ApiSharedErrorCode,
  ApiStakeVaultError,
  ApiStakeVaultErrorCode,
  ApiTradingWalletError,
  ApiTradingWalletErrorCode,
} from '~/redux/api/error';
import { TransactionError, TransactionErrorCode } from '~/redux/saga/transaction/utils';
import { WalletError, WalletErrorCode } from '~/types/wallet';

import { UIKitError } from './errorHandlingUtils';

const defaultApiServerErrorMessage = 'Unknown server error';

export const noBestAvailableOrderFoundMessage =
  'Matching order not found for requested amount';

export const failedRetrievingBestAvailableOrderMessage =
  'An issue has prevented us from finding a market order, please try again later';

export const apiErrorToMessage = (error: ApiError): string => {
  if (error instanceof ApiSharedError) {
    switch (error.errorCode) {
      case ApiSharedErrorCode.TRANSACTION__NO_SUITABLE_COLLATERAL:
        return 'Collateral could not be found, please add more ADA to wallet or set collateral manually';
      case ApiSharedErrorCode.NETWORK__TIMEOUT:
        return 'Request timed out, please try again';
    }
  } else if (error instanceof ApiStakeVaultError) {
    switch (error.errorCode) {
      case ApiStakeVaultErrorCode.INVALID_STAKE_VAULT__NFT_COMBINATION:
        return 'You may not combine NFTs of the same type';
      case ApiStakeVaultErrorCode.INVALID_STAKE_VAULT__INSUFFICIENT_BALANCE:
        return 'Not enough funds to perform transaction';
      case ApiStakeVaultErrorCode.INVALID_STAKE_VAULT__VESTING_NFTS_NOT_ALLOWED:
        return 'Genius Yield ISPO NFTs are no longer allowed to be staked';
      case ApiStakeVaultErrorCode.INVALID_STAKE_VAULT__WALLET_ADDRESS_MISSING_STAKE_PART:
        return 'Error retrieving wallet address staking credentials';
      case ApiStakeVaultErrorCode.INVALID_STAKE_VAULT__INVALID_LOCK_DURATION:
        return 'Selected lock period is not valid for this project';
      case ApiStakeVaultErrorCode.INVALID_STAKE_VAULT__STAKED_ASSET_AMOUNT_NOT_NUMBER:
        return 'Unexpected error, please try again';
      case ApiStakeVaultErrorCode.INVALID_STAKE_VAULT__STAKED_ASSET_TOTAL_AMOUNT_LIMIT_REACHED:
        return 'The total limit of staked tokens has been reached for this project';
    }
  } else if (error instanceof ApiTradingWalletError) {
    switch (error.errorCode) {
      case ApiTradingWalletErrorCode.INVALID_TRADING_WALLET__INCORRECT_STAKE_KEY_HASH_FORMAT:
        return 'Invalid stake key hash format. Must be valid Bech32 or raw hex string.';
      case ApiTradingWalletErrorCode.INVALID_TRADING_WALLET__ALREADY_EXISTS:
        return 'You have already registered this trading bot';
    }
  } else if (error instanceof ApiOrderError) {
    /**
     * TODO: Temporary - we should be getting this returned on stake vault error codes.
     * However, the API server is only mapping to this error code.
     */
    switch (error.errorCode) {
      case ApiOrderErrorCode.INVALID_ORDER__INSUFFICIENT_BALANCE:
        return 'Not enough funds to perform transaction';
      case ApiOrderErrorCode.ORDER__BEST_AVAILABLE_ORDER_NOT_FOUND:
        return noBestAvailableOrderFoundMessage;
      case ApiOrderErrorCode.INVALID_ORDER__UTXO_CONSUMED:
        return 'Provided UTxO has already been spent, please try again in a minute';
      case ApiOrderErrorCode.INVALID_ORDER__ORDER_NOT_ACTIVE_OR_EXPIRED:
        return defaultApiServerErrorMessage;
    }
  } else if (error instanceof ApiGeneralError) {
    return defaultApiServerErrorMessage;
  } else {
    /**
     * Typing this as `never` will make TypeScript warn us if we have not
     * handled all event types in our above cases.
     */
    const unhandledError: never = error;
    console.warn(`Expected error ${unhandledError} to be handled`);

    return defaultApiServerErrorMessage;
  }
};

const defaultUiKitErrorMessage = 'Unknown error';
/**
 * We treat `error.message` as debug information that's not displayed to the user.
 *
 * We use `error.errorCode` as the canonical information about what type of error
 * we've run into. We will later use this as an i18n identifier for translations.
 */
export const uiKitErrorToMessage = (error: UIKitError): string => {
  if (
    error instanceof ApiGeneralError ||
    error instanceof ApiSharedError ||
    error instanceof ApiStakeVaultError ||
    error instanceof ApiTradingWalletError ||
    error instanceof ApiOrderError
  ) {
    return apiErrorToMessage(error);
  } else if (error instanceof TransactionError) {
    switch (error.errorCode) {
      case TransactionErrorCode.FAILED_RESPONSE_VALIDATION:
      case TransactionErrorCode.UNKNOWN_TRANSACTION_ERROR:
      case TransactionErrorCode.INVALID_REQUEST_PAYLOAD:
      case TransactionErrorCode.FAILED_PRODUCING_PENDING_TRANSACTION:
        return 'Transaction failed, please try again';
    }
  } else if (error instanceof WalletError) {
    switch (error.errorCode) {
      case WalletErrorCode.FUNCTION_NOT_IMPLEMENTED:
        return 'Internal wallet error';
      case WalletErrorCode.INVALID_OR_MISSING_STAKE_KEY_HASH:
      case WalletErrorCode.WALLET_NOT_FOUND:
      case WalletErrorCode.WALLET_GLOBAL_NOT_FOUND:
      case WalletErrorCode.WALLET_ACCOUNT_NOT_FOUND:
      case WalletErrorCode.WALLET_TYPES_NOT_FOUND:
      case WalletErrorCode.WALLET_PROVIDER_NOT_FOUND:
        return 'Error retrieving wallet, please reconnect';
      case WalletErrorCode.USER_DECLINED_SIGNING:
        return 'User declined to sign the transaction';
      case WalletErrorCode.USER_SIGNING_FAILED:
        return 'User signing has failed';
    }
    /**
     * Checking `Error` instead of the alias `UnexpectedError`
     * because the latter is not exported as a value in ui-kit and it's not
     * trivial to solve.
     */
  } else if (error instanceof Error) {
    return defaultUiKitErrorMessage;
  } else {
    /**
     * Typing this as `never` will make TypeScript warn us if we have not
     * handled all event types in our above cases.
     */
    const unhandledError: never = error;
    console.warn(`Expected error ${unhandledError} to be handled`);

    return defaultUiKitErrorMessage;
  }
};
