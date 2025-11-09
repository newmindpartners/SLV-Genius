import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '~/hooks/wallet/wallet';
import {
  FillSwapOrder,
  SwapOrderTakerTotalFees,
  useGetSwapOrderFillFeeMutation,
} from '~/redux/api';
import { parseApiErrorToMessage } from '~/utils/errorHandlingUtils';

import { FillSwapOrderProps } from './submit';

const FETCH_FEES_DEBOUNCE_MS = 350;

type UseSwapOrderFeeProps = {
  transactionFee: SwapOrderTakerTotalFees | null;
  isLoading: boolean;
  getTransactionFee: (data: FillSwapOrderData, orderId: string) => void;
};

export type FillSwapOrderData = Pick<FillSwapOrder, 'toAssetAmount'>;

const useSwapDirectFillOrderFetchFee = (): UseSwapOrderFeeProps => {
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
    debounce(async ({ orderId, toAssetAmount }: FillSwapOrderProps) => {
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

        const directFillSwapOrder: FillSwapOrder = {
          toAssetAmount,
          orderReference: {
            orderId,
          },
        };

        const fillSwapOrders: FillSwapOrder[] = [directFillSwapOrder];

        fetchTransactionFee({
          fillSwapOrders: {
            ...walletDetails,
            fillSwapOrders,
            orderFillType: 'FILL_DIRECT',
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
    ({ toAssetAmount }: FillSwapOrderData, orderId: string) => {
      if (toAssetAmount === '0') {
        return;
      }

      setIsPreparingFeeRequest(true);
      getTransactionFeeDebounced({ toAssetAmount, orderId });
    },
    [
      getWalletChangeAddress,
      getWalletUsedAddresses,
      getWalletUnusedAddresses,
      getWalletCollateralUtxo,
    ],
  );

  return {
    transactionFee: transactionFeeResponse?.data || null,
    isLoading: transactionFeeResponse.isLoading || isPreparingFeeRequest,
    getTransactionFee,
  };
};

export default useSwapDirectFillOrderFetchFee;
