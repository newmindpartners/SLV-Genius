import { api } from '~/redux/api';
import {
  CancelTwoWayOrderApiArg,
  FillTwoWayOrderApiArg,
  PlaceTwoWayOrderApiArg,
  TwoWayOrderCancel,
  TwoWayOrderFill,
  TwoWayOrderPlace,
  WalletAccount,
} from '~/redux/api/core';
import { ApiGeneralError, ApiOrderError, ApiSharedError } from '~/redux/api/error';
import { TransactionEndpoints, TransactionEndpointsData } from '~/types/transaction';
import { WalletError } from '~/types/wallet';

export type TransactionRequestError =
  | ApiGeneralError
  | ApiSharedError
  | ApiOrderError
  | TransactionError
  | WalletError
  | UnexpectedError;

export const isExpectedError = (error: unknown): error is TransactionRequestError =>
  error instanceof ApiGeneralError ||
  error instanceof ApiSharedError ||
  error instanceof ApiOrderError ||
  error instanceof TransactionError ||
  error instanceof WalletError;

export enum TransactionErrorCode {
  FAILED_RESPONSE_VALIDATION = 'FAILED_RESPONSE_VALIDATION',
  UNKNOWN_TRANSACTION_ERROR = 'UNKNOWN_TRANSACTION_ERROR',
  INVALID_REQUEST_PAYLOAD = 'INVALID_REQUEST_PAYLOAD',
  FAILED_PRODUCING_PENDING_TRANSACTION = 'FAILED_PRODUCING_PENDING_TRANSACTION',
}

export class TransactionError extends Error {
  constructor(readonly errorCode: TransactionErrorCode, message: string | null = null) {
    super(message || errorCode);
  }
}

export class UnexpectedError extends Error {}

/**
 * When we catch errors in our transaction saga, we by design don't know what error that is
 * even though we have made sure it will only be the "expected errors" listed above.
 * So for the consumer of these sagas to get type information about the thrown errors, we need
 * to assert their type.
 */
export const typeAssertError = (error: unknown): TransactionRequestError =>
  isExpectedError(error) ? error : (error as UnexpectedError);

export function prepareEndpointAction(
  endpoint: TransactionEndpoints,
  data: TransactionEndpointsData,
  walletAccount: WalletAccount,
) {
  /**
   * For us to call the `endpoint` with the `data`, they have to be of the same type.
   * Since we seem unable to infer the type of `data` based on the type of `endpoint`,
   * we have to make these conditional checks.
   */
  if (endpoint === TransactionEndpoints.OPEN_SALE_ORDER && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.CANCEL_SALE_ORDER && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.OPEN_SWAP_ORDER && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.FILL_SWAP_ORDERS && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.CANCEL_SWAP_ORDER && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.PLACE_TWO_WAY_ORDER) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    type PlaceData = { twoWayOrderPlace: Omit<TwoWayOrderPlace, keyof WalletAccount> };
    const { twoWayOrderPlace } = data as PlaceData;
    const args: PlaceTwoWayOrderApiArg = {
      twoWayOrderPlace: {
        ...walletAccount,
        ...twoWayOrderPlace,
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.FILL_TWO_WAY_ORDER) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    type FillData = { twoWayOrderFill: Omit<TwoWayOrderFill, keyof WalletAccount> };
    const { twoWayOrderFill } = data as FillData;
    const args: FillTwoWayOrderApiArg = {
      twoWayOrderFill: {
        ...walletAccount,
        ...twoWayOrderFill,
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.CANCEL_TWO_WAY_ORDER) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    type CancelData = { twoWayOrderCancel: Omit<TwoWayOrderCancel, keyof WalletAccount> };
    const { twoWayOrderCancel } = data as CancelData;
    const args: CancelTwoWayOrderApiArg = {
      twoWayOrderCancel: {
        ...walletAccount,
        ...twoWayOrderCancel,
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.CREATE_STAKE_VAULT && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.UNSTAKE_STAKE_VAULT && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (
    endpoint === TransactionEndpoints.YIELD_FARMING_REWARDS_CLAIM &&
    endpoint in data
  ) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.CREATE_OPTION && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.EXECUTE_OPTION && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.RETRIEVE_OPTION && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.OPEN_SMART_VAULT && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.WITHDRAW_SMART_VAULT && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.DEPOSIT_SMART_VAULT && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else if (endpoint === TransactionEndpoints.CLOSE_SMART_VAULT && endpoint in data) {
    const transactionInitiate = api.endpoints[endpoint].initiate;
    const args = {
      ...data,
      [endpoint]: {
        ...walletAccount,
        ...data[endpoint],
      },
    };
    return transactionInitiate(args);
  } else {
    /**
     * This error is thrown if we pass a payload type that doesn't corresponds to the endpoint.
     * For example, passing endpoint `"cancelSaleOrder"` while providing data for `openSaleOrder`.
     */
    throw new TransactionError(TransactionErrorCode.INVALID_REQUEST_PAYLOAD);
  }
}
