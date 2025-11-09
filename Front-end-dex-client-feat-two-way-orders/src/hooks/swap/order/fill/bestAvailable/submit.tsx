import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { useAlertDialog } from '~/context/alertDialog';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import { BestAvailableSwapOrderResults } from '~/redux/api';
import { TransactionEndpoints, TransactionEndpointsData } from '~/types/transaction';
import { UIKitError } from '~/utils/errorHandlingUtils';
import {
  noBestAvailableOrderFoundMessage,
  uiKitErrorToMessage,
} from '~/utils/stringUtils';
import { bestAvailableResultToFillSwapOrders } from '~/utils/swapOrderUtils';
import { TradingPairAmounts, TradingPairAssets } from '~/utils/tradingPairsUtils';

type UseSwapOrderCreationArgs = {
  onCreateOrderSuccess: () => void;
};

type PlaceOrderProps = {
  selectedAssets: TradingPairAssets;
  tradingPairAmounts: TradingPairAmounts;
  swapOrders: BestAvailableSwapOrderResults;
};

type BestAvailableOrderData = {
  swapOrders: BestAvailableSwapOrderResults;
  fromAssetAmount: string;
  fromAssetPrecision: number;
};

const useSwapBestAvailableOrderSubmit = ({
  onCreateOrderSuccess,
}: UseSwapOrderCreationArgs) => {
  const [isLoading, setIsLoading] = useState(false);
  const { onDialogOpen: openAlertDialog } = useAlertDialog();

  const dispatch = useDispatch();

  const onCreateSwapOrderFailure = (message: string) => {
    openAlertDialog({
      alertType: AlertType.Failure,
      title: message,
    });
    setIsLoading(false);
  };

  const onCreateSwapOrderSuccess = () => {
    setIsLoading(false);
    onCreateOrderSuccess();
  };

  const handlePlaceOrderServerSubmission = (
    bestAvailableOrders: BestAvailableOrderData,
  ) => {
    setIsLoading(true);

    const bestAvailableOrdersToFill = bestAvailableResultToFillSwapOrders(
      bestAvailableOrders.swapOrders,
    );

    if (!bestAvailableOrdersToFill) {
      onCreateSwapOrderFailure(noBestAvailableOrderFoundMessage);
    } else {
      const data: TransactionEndpointsData = {
        [TransactionEndpoints.FILL_SWAP_ORDERS]: {
          orderFillType: 'FILL_BEST_AVAILABLE',
          fillSwapOrders: bestAvailableOrdersToFill,
        },
      };

      dispatch(
        createSignSubmitTransactionRequest({
          endpoint: TransactionEndpoints.FILL_SWAP_ORDERS,
          data: data,
          callback: {
            onSuccess: onCreateSwapOrderSuccess,
            onFailure: (error: UIKitError) =>
              onCreateSwapOrderFailure(uiKitErrorToMessage(error)),
          },
        }),
      );
    }
  };

  const handlePlaceOrder = ({
    selectedAssets,
    tradingPairAmounts,
    swapOrders,
  }: PlaceOrderProps) => {
    if (tradingPairAmounts.to === null || tradingPairAmounts.from === null) {
      openAlertDialog({
        alertType: AlertType.Failure,
        title: 'Token amounts to trade are not set',
      });
      return;
    }

    if (!selectedAssets.to || !selectedAssets.from) {
      openAlertDialog({
        alertType: AlertType.Failure,
        title: 'Failed to resolve token pair',
      });
      return;
    }

    if (!swapOrders) {
      openAlertDialog({
        alertType: AlertType.Failure,
        title: 'Failed to fetch best available order',
      });
      return;
    }

    const data: BestAvailableOrderData = {
      swapOrders,
      fromAssetAmount: tradingPairAmounts.to,
      fromAssetPrecision: selectedAssets.to.decimalPrecision,
    };

    handlePlaceOrderServerSubmission(data);
  };

  return {
    isLoading,
    handlePlaceOrder,
  };
};

export default useSwapBestAvailableOrderSubmit;
