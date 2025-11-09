import { deepEqual } from 'assert';
import { select } from 'redux-saga/effects';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { getProxyWallet } from '~/redux/saga/wallet';
import { TransactionEndpoints } from '~/types/transaction';

import { createSignSubmitTransaction } from '.';

test('Sign and submit transaction: disconnected wallet', async () => {
  const endpoint = TransactionEndpoints.OPEN_SALE_ORDER;

  const generator = createSignSubmitTransaction(
    createSignSubmitTransactionRequest({
      endpoint,
      data: {
        [endpoint]: {
          roundId: 'f42d693d-3068-422e-b864-c9543bb39dbc',
          baseAssetId: 'asset15hyr44un9yfzn8fjlmdj8vz8tyv6j4adz64e2f',
          baseAssetAmount: '1',
        },
      },
      callback: {
        onSuccess: () => null,
        onRequest: () => null,
        onFailure: (error: Error) => `${error}`,
      },
    }),
  );

  deepEqual(
    generator.next().value,
    select(getProxyWallet),
    'it should select wallet data',
  );

  deepEqual(
    generator.next({ isConnected: () => false }).done,
    true,
    'it should be done if the wallet received is not connected',
  );
});
