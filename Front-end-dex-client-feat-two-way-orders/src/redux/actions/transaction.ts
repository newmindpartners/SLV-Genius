import { createAction } from '@reduxjs/toolkit';
import {
  CreateSignSubmitTransactionFailurePayload,
  CreateSignSubmitTransactionRequestPayload,
  CreateSignSubmitTransactionSuccessPayload,
} from '~/types/transaction';

export const createSignSubmitTransactionRequest =
  createAction<CreateSignSubmitTransactionRequestPayload>(
    'CREATE_SIGN_SUBMIT_TRANSACTION_REQUEST',
  );

export const createSignSubmitTransactionSuccess =
  createAction<CreateSignSubmitTransactionSuccessPayload>(
    'CREATE_SIGN_SUBMIT_TRANSACTION_SUCCESS',
  );

export const createSignSubmitTransactionFailure =
  createAction<CreateSignSubmitTransactionFailurePayload>(
    'CREATE_SIGN_SUBMIT_TRANSACTION_FAILURE',
  );
