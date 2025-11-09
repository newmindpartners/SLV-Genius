import { WalletApi } from 'lucid-cardano';

export const getPubKeyHashes = async (): Promise<string[]> => {
  const api = (await window.cardano.nami.enable()) as WalletApi;

  const usedAddresses = await api.getUsedAddresses();
  const unusedAddresses = await api.getUnusedAddresses();
  const changeAddress = await api.getChangeAddress();

  const pkhs = [];

  for (const addr of unusedAddresses.concat(usedAddresses, changeAddress)) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(
      'https://dev.tx.geniusyield.co/Tx/pubKeyHash/' + encodeURIComponent(addr),
      requestOptions,
    );

    const pkh = await response.json();

    pkhs.push(pkh);
  }

  return pkhs;
};
