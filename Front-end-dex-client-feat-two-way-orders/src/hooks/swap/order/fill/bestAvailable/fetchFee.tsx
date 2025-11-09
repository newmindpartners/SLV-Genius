import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '~/hooks/wallet/wallet';
import {
  BestAvailableSwapOrderResults,
  FillSwapOrder,
  SwapOrderTakerTotalFees,
  useGetSwapOrderFillFeeMutation,
} from '~/redux/api';
import { parseApiErrorToMessage } from '~/utils/errorHandlingUtils';
import { isValidBig, unitToIndivisible } from '~/utils/mathUtils';
import { noBestAvailableOrderFoundMessage } from '~/utils/stringUtils';
import { bestAvailableResultToFillSwapOrders } from '~/utils/swapOrderUtils';
import { TradingPairAmounts, TradingPairAssets } from '~/utils/tradingPairsUtils';

const FETCH_FEES_DEBOUNCE_MS = 350;

type UseSwapOrderFeeProps = {
  transactionFee: SwapOrderTakerTotalFees | null;
  isLoading: boolean;
};

type UseSwapBestAvailableOrderFetchFeeProps = {
  tradingPairAmounts: TradingPairAmounts;
  selectedAssets: TradingPairAssets;
  isWalletConnected: boolean;
  bestAvailableSwapOrders?: BestAvailableSwapOrderResults;
};

type FillSwapOrderData = Pick<FillSwapOrder, 'toAssetAmount'>;

const useSwapBestAvailableOrderFetchFee = ({
  selectedAssets,
  tradingPairAmounts,
  isWalletConnected,
  bestAvailableSwapOrders,
}: UseSwapBestAvailableOrderFetchFeeProps): UseSwapOrderFeeProps => {
  const [fetchTransactionFee, transactionFeeResponse] = useGetSwapOrderFillFeeMutation();
  const [isPreparingFeeRequest, setIsPreparingFeeRequest] = useState(false);
  const {
    getWalletChangeAddress,
    getWalletUnusedAddresses,
    getWalletUsedAddresses,
    getWalletCollateralUtxo,
  } = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  const getTransactionFeeDebounced = useCallback(
    debounce(async (bestAvailableResult: BestAvailableSwapOrderResults) => {
      const walletChangeAddress = await getWalletChangeAddress();

      if (walletChangeAddress) {
        const [walletUsedAddresses, walletUnusedAddresses, collateralUtxo] =
          await Promise.all([
            getWalletUsedAddresses(),
            getWalletUnusedAddresses(),
            getWalletCollateralUtxo(),
          ]);

        const walletDetails = {
          walletAddress: walletChangeAddress,
          collateralUtxo,
          walletUsedAddresses,
          walletUnusedAddresses,
        };

        const bestAvailableOrdersToFill =
          bestAvailableResultToFillSwapOrders(bestAvailableResult);

        if (!bestAvailableOrdersToFill) {
          enqueueSnackbar(noBestAvailableOrderFoundMessage, { variant: 'error' });
        } else {
          fetchTransactionFee({
            fillSwapOrders: {
              ...walletDetails,
              orderFillType: 'FILL_BEST_AVAILABLE',
              fillSwapOrders: bestAvailableOrdersToFill,
            },
          });
        }
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
    (data: FillSwapOrderData, bestAvailableSwapOrders: BestAvailableSwapOrderResults) => {
      if (data.toAssetAmount === '0') {
        return;
      }

      setIsPreparingFeeRequest(true);
      getTransactionFeeDebounced(bestAvailableSwapOrders);
    },
    [
      getWalletChangeAddress,
      getWalletUsedAddresses,
      getWalletUnusedAddresses,
      getWalletCollateralUtxo,
    ],
  );

  useEffect(() => {
    const isAmountValid = tradingPairAmounts.to && isValidBig(tradingPairAmounts.to);

    if (
      isWalletConnected &&
      selectedAssets.from &&
      selectedAssets.to &&
      bestAvailableSwapOrders &&
      isAmountValid
    ) {
      getTransactionFee(
        {
          toAssetAmount: tradingPairAmounts.to
            ? unitToIndivisible(tradingPairAmounts.to, selectedAssets.to.decimalPrecision)
            : '0',
        },
        bestAvailableSwapOrders,
      );
    }
  }, [tradingPairAmounts, selectedAssets, isWalletConnected, bestAvailableSwapOrders]);

  return {
    transactionFee: transactionFeeResponse?.data || null,
    isLoading: transactionFeeResponse.isLoading || isPreparingFeeRequest,
  };
};

export default useSwapBestAvailableOrderFetchFee;
