import { useEffect } from 'react';
import {
  OrderCardOrderType,
  useAdvancedSettings,
} from '~/context/advancedSettingsContext';
import useSwapLimitOrder, {
  defaultLimitOrderAdvancedSettings,
} from '~/hooks/swap/order/limit';
import { UseSwapOrderCardResult } from '~/pages/Swap/components/OrderCard/hooks/order-card';
import { checkIfAssetsCompatible } from '~/pages/Swap/components/OrderCard/hooks/order-card/useSwapOrderFields';
import { isGreater } from '~/utils/mathUtils';

type UseSwapLimitOrderCardArgs = {
  activeOrderType: OrderCardOrderType;
};

const useSwapLimitOrderCard = ({
  activeOrderType,
}: UseSwapLimitOrderCardArgs): UseSwapOrderCardResult => {
  const isActive = activeOrderType === 'limit';

  const {
    fee,
    price,
    to,
    from,
    handleSubmitOrder,
    selectedAssets,
    isWalletConnected,
    handleSetTradingPairAmounts,
    switchTradingPairs,
  } = useSwapLimitOrder();
  const { setAdvancedSettings } = useAdvancedSettings();

  useEffect(() => {
    handleSetTradingPairAmounts({
      from: null,
      to: null,
    });

    if (isActive) {
      setAdvancedSettings({
        ...defaultLimitOrderAdvancedSettings,
      });
    }
  }, [isActive]);

  const isAmountValid =
    isGreater(to.value || '0', '0') && isGreater(from.value || '0', '0');

  const isTradingPairValid =
    to.value && from.value && checkIfAssetsCompatible(selectedAssets);

  const isSwapOrderSubmissionDisabled =
    !isWalletConnected || !isAmountValid || !isTradingPairValid;

  const isFeeVisible = isWalletConnected;

  return {
    fee: {
      ...fee,
      isVisible: isFeeVisible,
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
        isDisabled: false,
        isLoading: false,
      },
      price: {
        ...price,
        isLoading: false,
        isDisabled: false,
      },
    },
    isSubmitOrderDisabled: isSwapOrderSubmissionDisabled,
    handleSetTradingPairAmounts,
    handleSubmitOrder,
    switchTradingPairs,
    defaultLimitOrderAdvancedSettings,
  };
};

export default useSwapLimitOrderCard;
