import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { useWalletBalanceRecord } from '~/hooks/wallet/walletBalanceRecord';
import { indivisibleToUnit } from '~/utils/mathUtils';

const useSwapFromAssetWalletBalance = () => {
  const walletBalance = useWalletBalanceRecord();
  const { enqueueSnackbar } = useSnackbar();

  const { selectedAssets } = useTradingPairs();

  const [selectedFromAssetBalance, setSelectedFromAssetBalance] = useState<string | null>(
    null,
  );
  const [selectedFromTokenWalletBalance, setSelectedFromTokenWalletBalance] =
    useState<string>('0');

  useEffect(() => {
    if (selectedAssets.from) {
      const newBalance = walletBalance[selectedAssets.from.assetId] || '0';
      setSelectedFromTokenWalletBalance(newBalance);
    }
  }, [selectedAssets.from, walletBalance]);

  useEffect(() => {
    const isDecimalPrecisionUnset =
      selectedAssets.from && typeof selectedAssets.from.decimalPrecision !== 'number';

    if (isDecimalPrecisionUnset) {
      enqueueSnackbar("Failed to fetch 'from' asset decimal precision", {
        variant: 'error',
      });

      setSelectedFromAssetBalance(null);
    } else if (selectedAssets.from) {
      const unitBalance = indivisibleToUnit(
        selectedFromTokenWalletBalance,
        selectedAssets.from.decimalPrecision,
      );

      setSelectedFromAssetBalance(unitBalance);
    } else {
      setSelectedFromAssetBalance(null);
    }
  }, [selectedAssets.from, selectedFromTokenWalletBalance]);

  return {
    selectedFromAssetBalance,
  };
};

export default useSwapFromAssetWalletBalance;
