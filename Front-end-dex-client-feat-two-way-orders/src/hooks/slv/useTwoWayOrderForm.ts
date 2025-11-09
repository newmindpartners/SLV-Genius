import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { useWalletBalanceRecord } from '~/hooks/wallet/walletBalanceRecord';
import type { SelectOption } from '~/pages/Swap/components/OrderCard/components/TextFieldIconSelect/TextFieldIconSelect';
import type { TwoWayOrderPlace } from '~/redux/api/core';
import { div, indivisibleToUnit, unitToIndivisible } from '~/utils/mathUtils';
import type { TradingAsset } from '~/utils/tradingPairsUtils';

type WalletFields =
  | 'walletAddress'
  | 'collateralUtxo'
  | 'walletUsedAddresses'
  | 'walletUnusedAddresses'
  | 'walletRewardAddresses';

export type TwoWayOrderDraft = Omit<TwoWayOrderPlace, WalletFields> & {
  straightPrice?: string;
};

type DraftField = keyof TwoWayOrderDraft;

const INITIAL_FORM_STATE: TwoWayOrderDraft = {
  fromAssetId: '',
  fromAssetName: '',
  fromAssetPolicyId: '',
  fromAssetAmount: '',
  toAssetId: '',
  toAssetName: '',
  toAssetPolicyId: '',
  toAssetAmount: '',
  effectiveFromDate: '',
  effectiveUntilDate: '',
};

const toIsoOrUndefined = (value?: string | null) =>
  value && value.trim() !== '' ? new Date(value).toISOString() : undefined;

const mapAssetToSelectOption = (
  asset: TradingAsset,
  walletBalance: Record<string, string>,
): SelectOption => ({
  id: asset.assetId,
  label: asset.shortName,
  symbol: asset.shortName,
  icon: asset.iconUrl,
  amount: walletBalance[asset.assetId]
    ? indivisibleToUnit(walletBalance[asset.assetId], asset.decimalPrecision)
    : null,
});

type DefaultAssetShortNames = {
  from?: string;
  to?: string;
};

type UseTwoWayOrderFormOptions = {
  initialState?: Partial<TwoWayOrderDraft>;
  defaultAssetShortNames?: DefaultAssetShortNames;
};

export const useTwoWayOrderForm = (options?: UseTwoWayOrderFormOptions) => {
  const { initialState, defaultAssetShortNames } = options ?? {};
  const { tradingAssets } = useTradingPairs();
  const walletBalance = useWalletBalanceRecord();

  const initialDraft = useMemo(
    () => ({
      ...INITIAL_FORM_STATE,
      ...(initialState ?? {}),
    }),
    [initialState],
  );

  const [draft, setDraft] = useState<TwoWayOrderDraft>(initialDraft);
  const [fromOption, setFromOption] = useState<SelectOption | null>(null);
  const [toOption, setToOption] = useState<SelectOption | null>(null);
  const defaultFromShortName = defaultAssetShortNames?.from;
  const defaultToShortName = defaultAssetShortNames?.to;

  const assetOptions = useMemo(
    () => tradingAssets.map((asset) => mapAssetToSelectOption(asset, walletBalance)),
    [tradingAssets, walletBalance],
  );

  const findAssetById = useCallback(
    (assetId: string) => tradingAssets.find((asset) => asset.assetId === assetId) ?? null,
    [tradingAssets],
  );

  useEffect(() => {
    if (!fromOption && draft.fromAssetId) {
      const option = assetOptions.find((opt) => opt.id === draft.fromAssetId);
      if (option) setFromOption(option);
    }
  }, [assetOptions, draft.fromAssetId, fromOption]);

  useEffect(() => {
    if (!toOption && draft.toAssetId) {
      const option = assetOptions.find((opt) => opt.id === draft.toAssetId);
      if (option) setToOption(option);
    }
  }, [assetOptions, draft.toAssetId, toOption]);

  useEffect(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  const setFieldValue = useCallback((field: DraftField, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const applyAssetSelection = useCallback(
    (fieldPrefix: 'from' | 'to', asset: TradingAsset) => {
      setDraft((prev) => ({
        ...prev,
        [`${fieldPrefix}AssetId`]: asset.assetId,
        [`${fieldPrefix}AssetName`]: asset.assetName,
        [`${fieldPrefix}AssetPolicyId`]: asset.policyId,
      }));
    },
    [],
  );

  useEffect(() => {
    if (fromOption && !assetOptions.some((option) => option.id === fromOption.id)) {
      setFromOption(null);
      setDraft((prev) => ({
        ...prev,
        fromAssetId: '',
        fromAssetName: '',
        fromAssetPolicyId: '',
      }));
    }
  }, [assetOptions, fromOption]);

  useEffect(() => {
    if (toOption && !assetOptions.some((option) => option.id === toOption.id)) {
      setToOption(null);
      setDraft((prev) => ({
        ...prev,
        toAssetId: '',
        toAssetName: '',
        toAssetPolicyId: '',
      }));
    }
  }, [assetOptions, toOption]);

  useEffect(() => {
    if (defaultFromShortName && !draft.fromAssetId) {
      const asset = tradingAssets.find((item) => item.shortName === defaultFromShortName);
      if (asset) {
        const option = mapAssetToSelectOption(asset, walletBalance);
        setFromOption(option);
        applyAssetSelection('from', asset);
      }
    }
  }, [
    applyAssetSelection,
    defaultFromShortName,
    draft.fromAssetId,
    tradingAssets,
    walletBalance,
  ]);

  useEffect(() => {
    if (defaultToShortName && !draft.toAssetId) {
      const asset = tradingAssets.find((item) => item.shortName === defaultToShortName);
      if (asset) {
        const option = mapAssetToSelectOption(asset, walletBalance);
        setToOption(option);
        applyAssetSelection('to', asset);
      }
    }
  }, [
    applyAssetSelection,
    defaultToShortName,
    draft.toAssetId,
    tradingAssets,
    walletBalance,
  ]);

  const selectFrom = useCallback(
    (option: SelectOption) => {
      const asset = findAssetById(option.id);
      if (!asset) return;

      setFromOption(option);
      applyAssetSelection('from', asset);
    },
    [applyAssetSelection, findAssetById],
  );

  const selectTo = useCallback(
    (option: SelectOption) => {
      const asset = findAssetById(option.id);
      if (!asset) return;

      setToOption(option);
      applyAssetSelection('to', asset);
    },
    [applyAssetSelection, findAssetById],
  );

  const resetForm = useCallback(() => {
    setDraft(initialDraft);
    setFromOption(null);
    setToOption(null);
  }, [initialDraft]);

  const isValid = useMemo(
    () =>
      draft.fromAssetId.trim() !== '' &&
      draft.fromAssetAmount.trim() !== '' &&
      draft.toAssetId.trim() !== '' &&
      draft.toAssetAmount.trim() !== '',
    [draft],
  );

  const buildSubmissionPayload = useCallback((): TwoWayOrderDraft | null => {
    const fromAsset = findAssetById(draft.fromAssetId);
    const toAsset = findAssetById(draft.toAssetId);

    if (!fromAsset || !toAsset) {
      return null;
    }

    return {
      ...draft,
      fromAssetAmount: unitToIndivisible(
        draft.fromAssetAmount,
        fromAsset.decimalPrecision,
      ),
      toAssetAmount: unitToIndivisible(draft.toAssetAmount, toAsset.decimalPrecision),
      effectiveFromDate: toIsoOrUndefined(draft.effectiveFromDate),
      effectiveUntilDate: toIsoOrUndefined(draft.effectiveUntilDate),
      straightPrice:
        draft.toAssetAmount && draft.fromAssetAmount
          ? div(draft.toAssetAmount, draft.fromAssetAmount)
          : undefined,
    };
  }, [draft, findAssetById]);

  return {
    assetOptions,
    draft,
    fromOption,
    toOption,
    isValid,
    setFieldValue,
    selectFrom,
    selectTo,
    resetForm,
    buildSubmissionPayload,
  };
};

export type UseTwoWayOrderFormReturn = ReturnType<typeof useTwoWayOrderForm>;
export type TwoWayOrderFormField = DraftField;
export type { UseTwoWayOrderFormOptions };
