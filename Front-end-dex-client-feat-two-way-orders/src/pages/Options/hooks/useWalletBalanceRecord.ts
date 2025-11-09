import { useEffect, useState } from 'react';
import { useWallet } from '~/hooks/wallet/wallet';
import { WalletBalanceRecord } from '~/utils/wallet';

import { parseWalletBalanceCborToRecord } from '../helpers/wallet/parseWalletBalanceRecord';

export const useWalletBalanceRecord = (): WalletBalanceRecord => {
  const { getWalletBalance, walletStakeKeyHash } = useWallet();
  const [walletBalanceRecords, setWalletBalanceRecords] = useState<WalletBalanceRecord>(
    {},
  );

  useEffect(() => {
    const fetchAndSetWalletBalance = async () => {
      try {
        const walletBalance = await getWalletBalance();

        if (walletBalance) {
          const assets = parseWalletBalanceCborToRecord(walletBalance);
          setWalletBalanceRecords(assets);
        } else {
          setWalletBalanceRecords({});
        }
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
        setWalletBalanceRecords({});
      }
    };

    fetchAndSetWalletBalance();
  }, [getWalletBalance, walletStakeKeyHash]);

  return walletBalanceRecords;
};
