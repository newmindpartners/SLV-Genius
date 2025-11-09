import { pick } from 'lodash';
import { Action } from 'redux';
import { all, call, put, putResolve, select, takeLatest } from 'redux-saga/effects';
import {
  createSignSubmitTransactionFailure,
  createSignSubmitTransactionRequest,
  createSignSubmitTransactionSuccess,
} from '~/redux/actions/transaction';
import { api } from '~/redux/api';
import {
  SignedTransaction,
  SubmitTransactionApiResponse,
  UnsignedTransaction,
  WalletAccount,
} from '~/redux/api/core';
import { unknownNetworkErrorToApiError } from '~/redux/api/error';
import { getProxyWallet, getWalletAccount } from '~/redux/saga/wallet';
import { GeneratorReturnType } from '~/types/shared';
import { CreateSignSubmitTransactionRequestPayload } from '~/types/transaction';
import { getTransactionEventTypeFromOperationName } from '~/types/transaction/endpoints';
import {
  CardanoWalletDataSignErrorCode,
  isCardanoWalletDataSignError,
  WalletError,
  WalletErrorCode,
  WalletProxy,
} from '~/types/wallet';

import {
  prepareEndpointAction,
  TransactionError,
  TransactionErrorCode,
  typeAssertError,
} from './utils';

export function* signTransaction(
  unsignedTransaction: UnsignedTransaction,
  wallet: WalletProxy,
  eventType: SignedTransaction['eventType'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<any, SignedTransaction, any> {
  const { transactionId, transactionPayload } = unsignedTransaction;
  const { signTransaction } = wallet;

  try {
    const transactionSignature = yield call(signTransaction, transactionPayload);

    const signedTransaction: SignedTransaction = {
      eventType,
      transactionId,
      transactionPayload,
      transactionSignature,
    };

    return signedTransaction;
  } catch (error) {
    // Check if the error is related to a user-cancelled transaction and throw with a specific error message.
    // Versions of Nami and Eternl have been returning AddressNotPK when we expect UserDeclined, (such as cancelling a transaction)
    // which is why we handle them both as if they were UserDeclined.
    // We make a difference between user-cancelled actions and other unexpected errors.
    if (isCardanoWalletDataSignError(error)) {
      switch (error.code) {
        case CardanoWalletDataSignErrorCode.AddressNotPK:
        case CardanoWalletDataSignErrorCode.UserDeclined:
          throw new WalletError(WalletErrorCode.USER_DECLINED_SIGNING);

        case CardanoWalletDataSignErrorCode.ProofGeneration:
          throw new WalletError(WalletErrorCode.USER_SIGNING_FAILED);

        default:
          throw error;
      }
    }

    throw error;
  }
}

type Response<T extends Record<string, unknown>> = {
  data?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
};

const validateResponse = <T extends Record<string, unknown>>({
  data,
  error,
}: Response<T>) => {
  if (error) {
    const apiError = unknownNetworkErrorToApiError(error);
    throw apiError;
  } else {
    if (data) {
      return data;
    } else {
      throw new TransactionError(TransactionErrorCode.FAILED_RESPONSE_VALIDATION);
    }
  }
};

export function* submitTransaction(
  signedTransaction: SignedTransaction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<any, SubmitTransactionApiResponse, any> {
  const action: Action = yield call(api.endpoints.submitTransaction.initiate, {
    signedTransaction,
  });
  const response = yield putResolve(action);

  return validateResponse<SubmitTransactionApiResponse>(response);
}

const isUnsignedTransaction = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: Record<string, any>,
): response is UnsignedTransaction =>
  typeof response.transactionId === 'string' &&
  typeof response.transactionPayload === 'string';

function* getPendingTransaction(
  payload: CreateSignSubmitTransactionRequestPayload,
  walletAccount: WalletAccount,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<unknown, UnsignedTransaction | null, any> {
  const { endpoint, data } = payload;

  const transactionAction = yield prepareEndpointAction(endpoint, data, walletAccount);

  const response = yield putResolve(transactionAction);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatedResponse = validateResponse<Record<string, any>>(response);

  if (isUnsignedTransaction(validatedResponse)) {
    const unsignedTx = pick(validatedResponse, ['transactionId', 'transactionPayload']);

    return unsignedTx;
  } else {
    return null;
  }
}

export function* createSignSubmitTransaction(
  action: ReturnType<typeof createSignSubmitTransactionRequest>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<unknown, void, any> {
  const {
    payload: { callback, endpoint },
  } = action;

  try {
    // Transaction request has started
    callback?.onRequest && callback.onRequest();

    // Get Wallet Account
    const wallet: WalletProxy = yield select(getProxyWallet);
    if (!wallet.isConnected()) return;

    const walletAccount: GeneratorReturnType<typeof getWalletAccount> = yield call(
      getWalletAccount,
      wallet,
    );
    if (!walletAccount) {
      throw new WalletError(WalletErrorCode.WALLET_ACCOUNT_NOT_FOUND);
    }

    const pendingTransaction: GeneratorReturnType<typeof getPendingTransaction> =
      yield call(getPendingTransaction, action.payload, walletAccount);

    if (!pendingTransaction) {
      throw new TransactionError(
        TransactionErrorCode.FAILED_PRODUCING_PENDING_TRANSACTION,
      );
    }

    // Sign transaction request
    const signedTransaction: GeneratorReturnType<typeof signTransaction> = yield call(
      signTransaction,
      pendingTransaction,
      wallet,
      getTransactionEventTypeFromOperationName(endpoint),
    );

    // Submit signed transaction request
    const response: SubmitTransactionApiResponse = yield call(
      submitTransaction,
      signedTransaction,
    );

    yield put(
      createSignSubmitTransactionSuccess({
        onSuccess: callback?.onSuccess,
        response,
      }),
    );
  } catch (error) {
    yield put(
      createSignSubmitTransactionFailure({
        error: typeAssertError(error),
        onFailure: callback?.onFailure,
      }),
    );
  }
}

export function* onCreateSignSubmitTransactionSuccess(
  action: ReturnType<typeof createSignSubmitTransactionSuccess>,
): Generator<unknown, void, unknown> {
  const {
    payload: { onSuccess, response },
  } = action;

  yield onSuccess && onSuccess(response);
}

function* onCreateSignSubmitTransactionFailure(
  action: ReturnType<typeof createSignSubmitTransactionFailure>,
): Generator<unknown, void, unknown> {
  const {
    payload: { error, onFailure },
  } = action;

  console.error('DEBUG', 'createSignSubmitTransaction >>> ', action, ' <<< ', error);

  yield onFailure && onFailure(error);
}

export default function* (): Generator<unknown, void, undefined> {
  yield all([
    takeLatest(
      createSignSubmitTransactionRequest.toString(),
      createSignSubmitTransaction,
    ),
    takeLatest(
      createSignSubmitTransactionSuccess.toString(),
      onCreateSignSubmitTransactionSuccess,
    ),
    takeLatest(
      createSignSubmitTransactionFailure.toString(),
      onCreateSignSubmitTransactionFailure,
    ),
  ]);
}
