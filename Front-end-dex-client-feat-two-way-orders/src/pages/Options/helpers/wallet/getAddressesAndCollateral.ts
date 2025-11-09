import { WalletApi } from 'lucid-cardano';

import { AddressesAndCollateral } from '../../types/AddressesAndCollateral';

export const getAddressesAndCollateral = async (
  api: WalletApi,
): Promise<AddressesAndCollateral> => {
  const usedAddrs = await api.getUsedAddresses();
  const unusedAddrs = await api.getUnusedAddresses();
  const changeAddr = await api.getChangeAddress();
  const collateral = await api.experimental.getCollateral();

  return {
    unusedAddrs: unusedAddrs,
    usedAddrs: usedAddrs,
    changeAddr: changeAddr,
    collateral: collateral[0],
  };
};
