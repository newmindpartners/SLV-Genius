import { useEffect, useState } from 'react';
import { parseWalletBalanceCborToRecord, WalletBalanceRecord } from '~/utils/wallet';

import { useWallet } from './wallet';

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
