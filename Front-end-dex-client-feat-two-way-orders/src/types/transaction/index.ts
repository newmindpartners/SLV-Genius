import { SubmitTransactionApiResponse } from '~/redux/api/core';
import { TransactionRequestError } from '~/redux/saga/transaction/utils';

import { CallbackHandlers } from '../shared';
import { TransactionEndpoints, TransactionEndpointsData } from './endpoints';

export * from './endpoints';

export interface CreateSignSubmitTransactionRequestPayload {
  data: TransactionEndpointsData;
  endpoint: TransactionEndpoints;
  callback: Pick<CallbackHandlers, 'onRequest'> &
    Pick<CreateSignSubmitTransactionSuccessPayload, 'onSuccess'> &
    Pick<CreateSignSubmitTransactionFailurePayload, 'onFailure'>;
}

export type CreateSignSubmitTransactionSuccessPayload = {
  onSuccess?: (response: SubmitTransactionApiResponse) => void;
  response: SubmitTransactionApiResponse;
};

export type CreateSignSubmitTransactionFailurePayload = {
  error: TransactionRequestError;
  onFailure?: (error: TransactionRequestError) => void;
};
