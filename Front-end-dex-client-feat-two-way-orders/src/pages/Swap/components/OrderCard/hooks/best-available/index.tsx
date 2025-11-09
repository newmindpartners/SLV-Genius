import { useEffect } from 'react';
import { OrderCardOrderType } from '~/context/advancedSettingsContext';
import useSwapBestAvailableOrder from '~/hooks/swap/order/fill/bestAvailable';
import { UseSwapOrderCardResult } from '~/pages/Swap/components/OrderCard/hooks/order-card';
import { checkIfAssetsCompatible } from '~/pages/Swap/components/OrderCard/hooks/order-card/useSwapOrderFields';
import { isGreater } from '~/utils/mathUtils';

type UseSwapLimitOrderCardArgs = {
  activeOrderType: OrderCardOrderType;
};

const useSwapBestAvailableOrderCard = ({
  activeOrderType,
}: UseSwapLimitOrderCardArgs): UseSwapOrderCardResult => {
  const isActive = activeOrderType === 'bestAvailable';

  const {
    price,
    handleSubmitOrder,
    fee,
    to,
    from,
    selectedAssets,
    isWalletConnected,
    handleSetTradingPairAmounts,
  } = useSwapBestAvailableOrder();

  useEffect(() => {
    handleSetTradingPairAmounts({
      from: null,
      to: null,
    });
  }, [isActive]);

  const isAmountValid =
    isGreater(to.value || '0', '0') && isGreater(from.value || '0', '0');

  const isFeeVisible = isWalletConnected;

  const isTradingPairValid = !!(
    to.value &&
    from.value &&
    checkIfAssetsCompatible(selectedAssets)
  );

  const isSwapOrderSubmissionDisabled =
    !isWalletConnected || !isAmountValid || !isTradingPairValid;

  return {
    switchTradingPairs: () => {},
    fee: {
      ...fee,
      isVisible: !!isFeeVisible,
    },
    fields: {
      from: {
        ...from,
        fiatValue: '',
        isDisabled: false,
        isLoading: false,
      },
      to: {
        ...to,
        fiatValue: '',
        isDisabled: true,
      },
      price: {
        ...price,
        isDisabled: true,
      },
    },
    handleSetTradingPairAmounts,
    isSubmitOrderDisabled: isSwapOrderSubmissionDisabled,
    handleSubmitOrder,
  };
};

export default useSwapBestAvailableOrderCard;
