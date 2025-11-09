import { FormEvent, useEffect, useState } from 'react';
import {
  AdvancedSettings,
  OrderCardOrderType,
  useAdvancedSettings,
} from '~/context/advancedSettingsContext';
import useSwapBestAvailableOrderCard from '~/pages/Swap/components/OrderCard/hooks/best-available';
import useSwapLimitOrderCard from '~/pages/Swap/components/OrderCard/hooks/limit';
import { FormattedFee } from '~/utils/swapOrderFeeUtils';
import { TradingAsset, TradingPairAmounts } from '~/utils/tradingPairsUtils';

export type OrderCardFields = {
  from: {
    value: string | null;
    fiatValue: string;
    onChange: (value: string) => void;
    isDisabled: boolean;
    isLoading: boolean;
    alternativeValue?: string | null;
  };
  to: {
    value: string | null;
    fiatValue: string;
    onChange: (value: string) => void;
    isDisabled: boolean;
    isLoading: boolean;
    alternativeValue?: string | null;
  };
  price: {
    value: string | null;
    fiatValue: string;
    onChange: (value: string) => void;
    isLoading: boolean;
    isDisabled: boolean;
  };
};

export type UseSwapOrderCardResult = {
  fee: {
    isLoading: boolean;
    isVisible: boolean;
    data: FormattedFee[];
  };
  fields: OrderCardFields;
  isSubmitOrderDisabled: boolean;
  handleSubmitOrder: (e: FormEvent<HTMLFormElement>) => void;
  handleSetTradingPairAmounts: (tradingPairAmounts: TradingPairAmounts) => void;
  switchTradingPairs: (
    fromAmount: string,
    toAmount: string,
    from: TradingAsset | null,
    to: TradingAsset | null,
  ) => void;
  defaultLimitOrderAdvancedSettings?: AdvancedSettings;
};

type useSwapOrderCardOrderType = {
  orderType: OrderCardOrderType;
  setOrderType: (orderType: OrderCardOrderType) => void;
};

const useSwapOrderCard = (): UseSwapOrderCardResult & useSwapOrderCardOrderType => {
  const [orderType, setOrderType] = useState<OrderCardOrderType>('limit');

  const limit = useSwapLimitOrderCard({ activeOrderType: orderType });
  const bestAvailable = useSwapBestAvailableOrderCard({ activeOrderType: orderType });

  const { advancedSettings, setAdvancedSettings } = useAdvancedSettings();

  const orders = {
    limit,
    bestAvailable,
  };

  useEffect(() => {
    setAdvancedSettings({
      ...advancedSettings,
      orderType,
    });
  }, [orderType]);

  const result: UseSwapOrderCardResult = orders[orderType];

  return {
    ...result,
    orderType,
    setOrderType,
  };
};

export default useSwapOrderCard;
