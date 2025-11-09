import { all, spawn } from 'redux-saga/effects';
import transactionSagas from '~/redux/saga/transaction';
import userSagas from '~/redux/saga/user';
import walletSagas from '~/redux/saga/wallet';

export function* root(): Generator<unknown, void, undefined> {
  yield all([spawn(userSagas)]);
  yield all([spawn(walletSagas)]);
  yield all([spawn(transactionSagas)]);
}
