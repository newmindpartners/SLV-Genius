import {getCardanoTransactionUrl} from '~/domain/utils/url.util';

test('transaction url', () => {
  const transactionUrl = getCardanoTransactionUrl(
    'http://explorer.cardano.org/TX_HASH',
    'TX_HASH'
  );

  expect(transactionUrl).toBe('http://explorer.cardano.org/TX_HASH');
});
