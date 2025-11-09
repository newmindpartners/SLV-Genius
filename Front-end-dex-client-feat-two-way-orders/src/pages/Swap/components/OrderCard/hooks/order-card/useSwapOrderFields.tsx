import { first, map } from 'lodash';
import { ChangeEvent, useCallback } from 'react';
import { OrderCardOrderType } from '~/context/advancedSettingsContext';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { useWalletBalanceRecord } from '~/hooks/wallet/walletBalanceRecord';
import { Asset } from '~/redux/api';
import {
  compare,
  div,
  indivisibleToUnit,
  plus,
  roundBigjs,
  times,
} from '~/utils/mathUtils';
import {
  clearStringNumericInput,
  isAssetADA,
  isValidInput,
} from '~/utils/swapOrderUtils';
import {
  defaultAdaPrecision,
  TradingAsset,
  TradingPairAmounts,
  TradingPairAssets,
} from '~/utils/tradingPairsUtils';
import { WalletBalanceRecord } from '~/utils/wallet';

import { OrderCardFields } from '.';
import {
  SelectOption,
  TextFieldIconSelectProps,
} from '../../components/TextFieldIconSelect/TextFieldIconSelect';

type UseSwapOrderFieldsArgs = OrderCardFields & {
  orderType: OrderCardOrderType;
  tradingAssets: TradingAsset[];
  switchTradingPairs: (
    fromAmount: string,
    toAmount: string,
    from: TradingAsset | null,
    to: TradingAsset | null,
  ) => void;
  selectedAssets: TradingPairAssets;
  handleSetTradingPairAssets: (selectedAssets: TradingPairAssets) => void;
  handleSetTradingPairAmounts: (tradingPairAmounts: TradingPairAmounts) => void;
  marketPriceFormatted: string | null;
};

// Prioritize GENS first, then ADA
const prioritizeAssets = (shortName: string) => {
  switch (shortName) {
    case 'GENS':
      return -2;
    case 'ADA':
      return -1;
    default:
      return 0;
  }
};

const prioritizeEnabledAssets = (a: SelectOption, b: SelectOption) =>
  a.disabled && !b.disabled ? 1 : !a.disabled && b.disabled ? -1 : 0;

const sortByAssetPriority = (a: SelectOption, b: SelectOption) =>
  prioritizeAssets(a.label) - prioritizeAssets(b.label);

const sortByBalanceDesc = (a: SelectOption, b: SelectOption) =>
  compare(b.amount || '0', a.amount || '0');

const sortOptionsByRelevance = (options: SelectOption[]): SelectOption[] =>
  options.sort(
    (a, b) =>
      prioritizeEnabledAssets(a, b) ||
      sortByAssetPriority(a, b) ||
      sortByBalanceDesc(a, b),
  );

const sortAssetsByAssetPriority = (a: Asset, b: Asset) =>
  prioritizeAssets(a.shortName) - prioritizeAssets(b.shortName);

const assetToSelectOption = (
  asset: Asset,
  isAssetDisabled: boolean,
  walletBalance: WalletBalanceRecord,
) => {
  const balance = walletBalance[asset.assetId];

  const option: SelectOption = {
    id: asset.assetId,
    label: asset.shortName,
    symbol: asset.shortName,
    icon: asset.iconUrl,
    disabled: isAssetDisabled,
    amount: balance ? indivisibleToUnit(balance, asset.decimalPrecision) : null,
  };
  return option;
};

const selectOptionToAsset = (option: SelectOption, assets: Asset[]) => {
  const id = option.id;
  const asset = assets.find((asset) => asset.assetId === id) as TradingAsset;
  return { ...asset };
};

export const checkIfAssetsCompatible = (selectedAssets: TradingPairAssets) => {
  const { from, to } = selectedAssets;
  return to?.allowedAssets.find((asset) => asset.assetId === from?.assetId);
};

const useSwapOrderFields = ({
  orderType,
  from,
  to,
  price,
  selectedAssets,
  tradingAssets,
  marketPriceFormatted,
  switchTradingPairs,
  handleSetTradingPairAssets,
  handleSetTradingPairAmounts,
}: UseSwapOrderFieldsArgs) => {
  const { selectedTradingPair } = useTradingPairs();

  const walletBalance = useWalletBalanceRecord();

  const onChangeFromAmount = useCallback(
    (amountInput: string) => {
      const newFromValue = clearStringNumericInput(
        amountInput,
        selectedAssets.from?.decimalPrecision ?? defaultAdaPrecision,
      );
      if (
        isValidInput(
          newFromValue,
          selectedAssets.from?.decimalPrecision ?? defaultAdaPrecision,
        )
      ) {
        from.onChange(newFromValue);
      }
    },
    [from.value, from.onChange, selectedAssets.from?.decimalPrecision],
  );

  const onChangeToAmount = useCallback(
    (amountInput: string) => {
      const newToValue = clearStringNumericInput(
        amountInput,
        selectedAssets.to?.decimalPrecision ?? defaultAdaPrecision,
      );
      if (
        isValidInput(
          newToValue,
          selectedAssets.to?.decimalPrecision ?? defaultAdaPrecision,
        )
      ) {
        to.onChange(newToValue);
      }
    },
    [to.value, to.onChange, selectedAssets.to?.decimalPrecision],
  );

  const updatePrice = (inputValue: string) => {
    const decimalPrecision = selectedAssets.from?.decimalPrecision ?? defaultAdaPrecision;

    const newPrice = clearStringNumericInput(inputValue, decimalPrecision);

    if (isValidInput(newPrice, decimalPrecision)) {
      price.onChange(newPrice);
    }
  };

  const handleChangePriceExternally = (e: ChangeEvent<HTMLInputElement>) => {
    const newPrice = clearStringNumericInput(e.target.value);

    if (isValidInput(newPrice)) {
      if (selectedAssets.from && isAssetADA(selectedAssets.from?.shortName)) {
        price.onChange(newPrice);
      } else {
        if (newPrice === '') {
          price.onChange('0');
          // TODO: This is hacky, we should consolidate the statement logic somehow
        } else if (Number(newPrice) === 0) {
          price.onChange(newPrice);
        } else {
          marketPriceFormatted && price.onChange(newPrice);
        }
      }
    }
  };

  const floor = (number: string, decimalPrecision: number) => {
    const flooredNumber = roundBigjs(number, decimalPrecision, 0);

    return flooredNumber.toString();
  };

  const handleSelectedOption = useCallback(
    (option: SelectOption, field: 'from' | 'to') => {
      const asset = selectOptionToAsset(option, tradingAssets);

      if (field === 'from') {
        const isAssetsCompatible = checkIfAssetsCompatible({
          from: asset,
          to: selectedAssets.to,
        });

        const compatibleToAsset: TradingAsset | null = isAssetsCompatible
          ? selectedAssets.to
          : null;

        const allowedToAssets = selectedAssets.to?.allowedAssets;

        const sortedAllowedToAssets: Asset[] | null = allowedToAssets
          ? allowedToAssets.sort(sortAssetsByAssetPriority)
          : null;

        const fallbackToAsset: Asset | null =
          (sortedAllowedToAssets && first(sortedAllowedToAssets)) || null;

        const fallbackToTradingAsset: TradingAsset | null =
          (fallbackToAsset &&
            tradingAssets.find((asset) => asset.assetId === fallbackToAsset.assetId)) ||
          null;

        const newToAsset = compatibleToAsset || fallbackToTradingAsset || null;
        const newFrom = from.value ? floor(from.value, asset.decimalPrecision) : null;

        handleSetTradingPairAmounts({
          from: newFrom,
          to: to.value,
        });

        handleSetTradingPairAssets({
          from: asset,
          to: newToAsset,
        });
      } else {
        const isAssetsCompatible = checkIfAssetsCompatible({
          from: selectedAssets.from,
          to: asset,
        });
        const newTo = to.value ? floor(to.value, asset.decimalPrecision) : null;

        handleSetTradingPairAmounts({
          from: from.value,
          to: newTo,
        });
        handleSetTradingPairAssets({
          from: isAssetsCompatible ? selectedAssets.from : null,
          to: asset,
        });
      }
    },
    [selectedAssets, tradingAssets, handleSetTradingPairAssets, from.value, to.value],
  );
  const displayedPrice = price.value;

  const sortedAvailableFromOptions: SelectOption[] = sortOptionsByRelevance(
    map(tradingAssets, (tradingAsset) =>
      assetToSelectOption(tradingAsset, false, walletBalance),
    ),
  );

  const sortedAvailableToOptions: SelectOption[] = sortOptionsByRelevance(
    map(tradingAssets, (tradingAsset) =>
      assetToSelectOption(
        tradingAsset,
        !checkIfAssetsCompatible({ to: tradingAsset, from: selectedAssets.from }),
        walletBalance,
      ),
    ),
  );

  const fromField: TextFieldIconSelectProps = {
    title: 'From',
    endAdornment: from.value && from.fiatValue !== null ? from.fiatValue : undefined,
    textField: {
      isLoading: from.isLoading,
      isDisabled: from.isDisabled,
      value: from.value || '',
      onChange: onChangeFromAmount,
    },
    selectedOption:
      selectedAssets.from &&
      assetToSelectOption(selectedAssets.from, false, walletBalance),
    setSelectedOption: (option) => handleSelectedOption(option, 'from'),
    availableOptions: sortedAvailableFromOptions,
  };

  const toField: TextFieldIconSelectProps = {
    title: 'To',
    endAdornment: to.value && to.fiatValue !== null ? to.fiatValue : undefined,
    textField: {
      isLoading: to.isLoading,
      isDisabled: to.isDisabled,
      value: to.value || '',
      onChange: onChangeToAmount,
    },
    selectedOption:
      selectedAssets.to && assetToSelectOption(selectedAssets.to, false, walletBalance),
    setSelectedOption: (option) => handleSelectedOption(option, 'to'),
    availableOptions: sortedAvailableToOptions,
  };

  const priceField = {
    price: displayedPrice,
    priceAsset: selectedTradingPair?.quoteAsset || null,
    isDisabled: price.isDisabled,
    isLoading: price.isLoading,
    handleChangePriceExternally,

    selectedAssets,
  };

  const handleSwitchTradingPairs = () => {
    const newFromAmount = to.value;
    const newToAmount = from.value;

    if (orderType === 'bestAvailable') {
      handleSetTradingPairAmounts({
        from: newFromAmount,
        to: null,
      });
      handleSetTradingPairAssets({
        to: selectedAssets.from,
        from: selectedAssets.to,
      });
    } else {
      switchTradingPairs(
        newFromAmount || '',
        newToAmount || '',
        selectedAssets.to,
        selectedAssets.from,
      );
    }
  };
  
  const calculateNewPrice = (
    priceValue: string,
    percentValue: number,
    isAboveMarketPrice: boolean,
  ): string => {
    /**
     * Assuming a change in 25% of an ada price of 0.6
     * If price is in ada it's a simple we can just do 0.6 * 0.75 to achieve 25% change
     * If price is not in ada, we must do 1 / (1 / 1.666667 * 1.25) = 1.333333
     * which when converted to ada, 1 / 1.333333 = 0.75 becomes 25% change
     */
    return isAboveMarketPrice
      ? plus(priceValue, times(priceValue, percentValue))
      : div(1, times(div(1, priceValue), 1 + percentValue));
  };

  const adjustPriceByPercentage = (
    marketPrice: string,
    percentageValue: number,
    isAboveMarketPrice: boolean,
  ) => {
    const newPriceValue = calculateNewPrice(
      marketPrice,
      percentageValue,
      isAboveMarketPrice,
    );
    updatePrice(newPriceValue);
  };

  return {
    toField,
    fromField,
    priceField,
    onChangeFromAmount,
    handleSwitchTradingPairs,
    adjustPriceByPercentage,
  };
};

export default useSwapOrderFields;
