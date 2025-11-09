import { useCallback } from 'react';
import { useWallet } from '~/hooks/wallet/wallet';
import {
  TwoWayOrderCancel,
  TwoWayOrderFill,
  TwoWayOrderList,
  TwoWayOrderPlace,
  UnsignedTransaction,
  useCancelTwoWayOrderMutation,
  useFillTwoWayOrderMutation,
  useGetTwoWayOrdersQuery,
  usePlaceTwoWayOrderMutation,
} from '~/redux/api/core';

export const useSLVApi = () => {
  const {
    walletStakeKeyHash,
    isWalletConnected,
    getWalletUsedAddresses,
    getWalletUnusedAddresses,
    getWalletCollateralUtxo,
    getWalletChangeAddress,
  } = useWallet();

  // RTK Query hooks
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders,
  } = useGetTwoWayOrdersQuery(undefined);
  const [placeOrder, { isLoading: isPlacingOrder, error: placeError }] =
    usePlaceTwoWayOrderMutation();
  const [fillOrder, { isLoading: isFillingOrder, error: fillError }] =
    useFillTwoWayOrderMutation();
  const [cancelOrder, { isLoading: isCancellingOrder, error: cancelError }] =
    useCancelTwoWayOrderMutation();

  const getTwoWayOrders = useCallback(async (): Promise<TwoWayOrderList> => {
    if (!isWalletConnected) {
      throw new Error('Wallet not connected');
    }

    const result = await refetchOrders();
    if (Array.isArray(result.data)) {
      return result.data;
    }
    throw new Error('Failed to fetch orders');
  }, [isWalletConnected, refetchOrders]);

  const buildWalletBase = useCallback(async () => {
    const [usedAddresses, unusedAddresses, collateralUtxo] = await Promise.all([
      getWalletUsedAddresses(),
      getWalletUnusedAddresses(),
      getWalletCollateralUtxo(),
    ]);

    const walletAddress = await getWalletChangeAddress();
    if (!walletAddress) throw new Error('Wallet address not found');

    return {
      walletAddress,
      walletUsedAddresses: usedAddresses || [],
      walletUnusedAddresses: unusedAddresses || [],
      collateralUtxo: collateralUtxo || [],
    };
  }, [
    getWalletUsedAddresses,
    getWalletUnusedAddresses,
    getWalletCollateralUtxo,
    getWalletChangeAddress,
  ]);

  const placeTwoWayOrder = useCallback(
    async (
      orderData: Omit<
        TwoWayOrderPlace,
        | 'walletAddress'
        | 'collateralUtxo'
        | 'walletUsedAddresses'
        | 'walletUnusedAddresses'
      >,
    ): Promise<UnsignedTransaction> => {
      if (!isWalletConnected) throw new Error('Wallet not connected');

      const walletBase = await buildWalletBase();

      const payload: TwoWayOrderPlace = {
        ...orderData,
        ...walletBase,
      };

      const unsigned = await placeOrder({ twoWayOrderPlace: payload }).unwrap();
      return unsigned;
    },
    [isWalletConnected, buildWalletBase, placeOrder],
  );

  const fillTwoWayOrder = useCallback(
    async (fillData: TwoWayOrderFill): Promise<UnsignedTransaction> => {
      if (!isWalletConnected) throw new Error('Wallet not connected');
      const result = await fillOrder({ twoWayOrderFill: fillData }).unwrap();
      return result;
    },
    [isWalletConnected, fillOrder],
  );

  const fillTwoWayOrderByUtxo = useCallback(
    async (utxoReference: string): Promise<UnsignedTransaction> => {
      if (!isWalletConnected) throw new Error('Wallet not connected');
      const walletBase = await buildWalletBase();
      const result = await fillOrder({
        twoWayOrderFill: { ...walletBase, utxoReference },
      }).unwrap();
      return result;
    },
    [isWalletConnected, buildWalletBase, fillOrder],
  );

  const cancelTwoWayOrder = useCallback(
    async (cancelData: TwoWayOrderCancel): Promise<UnsignedTransaction> => {
      if (!isWalletConnected) throw new Error('Wallet not connected');
      const result = await cancelOrder({ twoWayOrderCancel: cancelData }).unwrap();
      return result;
    },
    [isWalletConnected, cancelOrder],
  );

  const cancelTwoWayOrderByUtxo = useCallback(
    async (utxoReference: string): Promise<UnsignedTransaction> => {
      if (!isWalletConnected) throw new Error('Wallet not connected');
      const walletBase = await buildWalletBase();
      const result = await cancelOrder({
        twoWayOrderCancel: { ...walletBase, utxoReference },
      }).unwrap();
      return result;
    },
    [isWalletConnected, buildWalletBase, cancelOrder],
  );

  // Combine loading states
  const isLoading =
    isLoadingOrders || isPlacingOrder || isFillingOrder || isCancellingOrder;

  // Combine error states
  const error = ordersError || placeError || fillError || cancelError;

  return {
    getTwoWayOrders,
    placeTwoWayOrder,
    fillTwoWayOrder,
    fillTwoWayOrderByUtxo,
    cancelTwoWayOrder,
    cancelTwoWayOrderByUtxo,
    isLoading,
    error: error
      ? (error as { data?: { message?: string } })?.data?.message || 'An error occurred'
      : null,
    isWalletConnected,
    walletStakeKeyHash,
    orders: Array.isArray(ordersData) ? ordersData : [],
  };
};
