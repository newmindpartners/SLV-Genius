import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '~/hooks/wallet/wallet';
import {
  SwapOrderData,
  SwapOrderMakerTotalFeesDeposit,
  SwapOrderTakerTotalFees,
  useGetSwapOrderOpenFeeMutation,
} from '~/redux/api';
import { parseApiErrorToMessage } from '~/utils/errorHandlingUtils';
import { unitToIndivisible } from '~/utils/mathUtils';
import { TradingPairAmounts, TradingPairAssets } from '~/utils/tradingPairsUtils';

const FETCH_FEES_DEBOUNCE_MS = 350;

type UseSwapOrderFeeProps = {
  transactionFee: (SwapOrderMakerTotalFeesDeposit & SwapOrderTakerTotalFees) | null;
  isLoading: boolean;
};

type useSwapLimitOrderFetchFeeArgs = {
  tradingPairAmounts: TradingPairAmounts;
  selectedAssets: TradingPairAssets;
  isWalletConnected: boolean;
};

const useSwapLimitOrderFetchFee = ({
  selectedAssets,
  tradingPairAmounts,
  isWalletConnected,
}: useSwapLimitOrderFetchFeeArgs): UseSwapOrderFeeProps => {
  const [fetchTransactionFee, transactionFeeResponse] = useGetSwapOrderOpenFeeMutation();
  const [isPreparingFeeRequest, setIsPreparingFeeRequest] = useState(false);
  const {
    getWalletChangeAddress,
    getWalletUnusedAddresses,
    getWalletUsedAddresses,
    getWalletCollateralUtxo,
  } = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  const getTransactionFeeDebounced = useCallback(
    debounce(async (swapOrder: SwapOrderData) => {
      const walletChangeAddress = await getWalletChangeAddress();

      if (walletChangeAddress) {
        const [walletUsedAddresses, walletUnusedAddresses, collateralUtxo] =
          await Promise.all([
            getWalletUsedAddresses(),
            getWalletUnusedAddresses(),
            getWalletCollateralUtxo(),
          ]);

        fetchTransactionFee({
          openSwapOrder: {
            ...swapOrder,
            walletAddress: walletChangeAddress,
            collateralUtxo,
            walletUsedAddresses,
            walletUnusedAddresses,
          },
        });
      } else {
        enqueueSnackbar(
          'Error retrieving wallet change address, try reconnecting the wallet!',
          {
            variant: 'error',
          },
        );
      }

      setIsPreparingFeeRequest(false);
    }, FETCH_FEES_DEBOUNCE_MS),
    [
      getWalletChangeAddress,
      getWalletUsedAddresses,
      getWalletUnusedAddresses,
      getWalletCollateralUtxo,
    ],
  );

  useEffect(() => {
    if (transactionFeeResponse.isError) {
      const errorMessage = parseApiErrorToMessage(transactionFeeResponse.error);

      enqueueSnackbar(
        errorMessage || "Couldn't fetch transaction fee. Please try again later.",
        {
          variant: 'error',
        },
      );
    }
  }, [transactionFeeResponse.isError]);

  const getTransactionFee = useCallback(
    (data: SwapOrderData) => {
      if (data.toAssetAmount === '0' || data.fromAssetAmount === '0') {
        return;
      }

      setIsPreparingFeeRequest(true);
      getTransactionFeeDebounced(data);
    },
    [
      getWalletChangeAddress,
      getWalletUsedAddresses,
      getWalletUnusedAddresses,
      getWalletCollateralUtxo,
    ],
  );

  useEffect(() => {
    if (isWalletConnected && selectedAssets.from && selectedAssets.to) {
      getTransactionFee({
        orderType: 'LIMIT',
        toAssetAmount: tradingPairAmounts.to
          ? unitToIndivisible(tradingPairAmounts.to, selectedAssets.to.decimalPrecision)
          : '0',
        toAssetId: selectedAssets.to.assetId,
        fromAssetAmount: tradingPairAmounts.from
          ? unitToIndivisible(
              tradingPairAmounts.from,
              selectedAssets.from.decimalPrecision,
            )
          : '0',
        fromAssetId: selectedAssets.from.assetId,
      });
    }
  }, [tradingPairAmounts, selectedAssets, isWalletConnected]);

  return {
    transactionFee: transactionFeeResponse?.data || null,
    isLoading: transactionFeeResponse.isLoading || isPreparingFeeRequest,
  };
};

export default useSwapLimitOrderFetchFee;
