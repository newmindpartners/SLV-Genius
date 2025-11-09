import { Stack, styled, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertType } from '~/components/Dialogs/AlertDialog';
import { useAlertDialog } from '~/context/alertDialog';
import { useWallet } from '~/hooks/wallet/wallet';
import { PillSelect } from '~/pages/Leaderboard/components/PillSelect';
import { createSignSubmitTransactionRequest } from '~/redux/actions/transaction';
import {
  CreateOptionData,
  ExecuteOption,
  RetrieveOption,
  WalletAccount,
} from '~/redux/api';
import { TransactionEndpoints } from '~/types/transaction';
import { unitToIndivisible } from '~/utils/mathUtils';

import { optionTypeOptions } from '../../constants/optionTypeOptions';
import { isOptionOwned } from '../../helpers/options/isOptionOwned';
import { isOptionWritten } from '../../helpers/options/isOptionWritten';
import { useGetOptionsQuery } from '../../hooks/useGetOptions';
import { useGetPubKeyHashesQuery } from '../../hooks/useGetPubKeyHashes';
import { useWalletBalanceRecord } from '../../hooks/useWalletBalanceRecord';
import { knownTokens } from '../../mock/knownTokens';
import { IOptionsFormData } from '../../schemas/optionsSchema';
import { OptionType } from '../../types/OptionType';
import { OptionsCard } from '../OptionsCard';
import { OptionsTable } from '../OptionsTable';

export const OptionsContent = () => {
  const isWalletMockConnected = true;

  const balance = useWalletBalanceRecord();
  const alert = useAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const {
    getWalletChangeAddress,
    getWalletUnusedAddresses,
    getWalletUsedAddresses,
    getWalletCollateralUtxo,
  } = useWallet();

  const { data: options, isLoading: isLoadingOptions } = useGetOptionsQuery();

  const { data: pubKeyHashes } = useGetPubKeyHashesQuery();

  const [isCreateOptionLoading, setIsCreateOptionLoading] = useState(false);

  const dispatch = useDispatch();

  const handleCreateOption = async (data: IOptionsFormData) => {
    const baseAsset = knownTokens.find((token) => token.assetId === data.deposit);
    const quoteAsset = knownTokens.find((token) => token.assetId === data.payment);

    if (!baseAsset || !quoteAsset) {
      enqueueSnackbar('Asset One or Asset Two is not selected. Please try again later.', {
        variant: 'error',
      });
      return;
    }

    const [
      walletChangeAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
      collateralUtxo,
    ] = await Promise.all([
      getWalletChangeAddress(),
      getWalletUsedAddresses(),
      getWalletUnusedAddresses(),
      getWalletCollateralUtxo(),
    ]);

    if (!walletChangeAddress) {
      enqueueSnackbar('Wallet Address not found. Please try again later.', {
        variant: 'error',
      });
      return;
    }

    const walletDetails = {
      walletAddress: walletChangeAddress,
      collateralUtxo,
      walletUsedAddresses,
      walletUnusedAddresses,
    };

    const option = {
      baseAssetAmount: unitToIndivisible(data.amount, baseAsset.decimals),
      baseAssetPrice: data.price,
      baseAssetId: baseAsset.assetId === 'lovelace' ? '' : baseAsset.assetId,
      quoteAssetId: quoteAsset.assetId === 'lovelace' ? '' : quoteAsset.assetId,
      quoteAssetShortName: quoteAsset.token,
      baseAssetShortName: baseAsset.token,
      endDate: data.endDate.toISOString(),
      startDate: new Date().toISOString(),
    };

    createOption(option, walletDetails);
  };

  const handleExecuteOption = async (reference: string, amount: string) => {
    const [
      walletChangeAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
      collateralUtxo,
    ] = await Promise.all([
      getWalletChangeAddress(),
      getWalletUsedAddresses(),
      getWalletUnusedAddresses(),
      getWalletCollateralUtxo(),
    ]);

    if (!walletChangeAddress) {
      enqueueSnackbar('Wallet Address not found. Please try again later.', {
        variant: 'error',
      });
      return;
    }

    const walletDetails = {
      walletAddress: walletChangeAddress,
      collateralUtxo,
      walletUsedAddresses,
      walletUnusedAddresses,
    };

    const executeOptionData = {
      ...walletDetails,
      optionUtxoRef: reference,
      optionAmount: amount,
    };

    executeOption(executeOptionData);
  };

  const handleRetrieveOption = async (reference: string, amount: string) => {
    const [
      walletChangeAddress,
      walletUsedAddresses,
      walletUnusedAddresses,
      collateralUtxo,
    ] = await Promise.all([
      getWalletChangeAddress(),
      getWalletUsedAddresses(),
      getWalletUnusedAddresses(),
      getWalletCollateralUtxo(),
    ]);

    if (!walletChangeAddress) {
      enqueueSnackbar('Wallet Address not found. Please try again later.', {
        variant: 'error',
      });
      return;
    }

    const walletDetails = {
      walletAddress: walletChangeAddress,
      collateralUtxo,
      walletUsedAddresses,
      walletUnusedAddresses,
    };

    const retrieveOptionData = {
      ...walletDetails,
      optionUtxoRef: reference,
      optionAmount: amount,
    };

    retrieveOption(retrieveOptionData);
  };

  const createOption = useCallback((option: CreateOptionData, wallet: WalletAccount) => {
    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.CREATE_OPTION,
        data: { [TransactionEndpoints.CREATE_OPTION]: { ...option, ...wallet } },
        callback: {
          onRequest: startCreateOptionLoading,
          onFailure: onCreateOptionFail,
          onSuccess: onCreateOptionSuccess,
        },
      }),
    );
  }, []);

  const startCreateOptionLoading = () => setIsCreateOptionLoading(true);

  const onCreateOptionSuccess = () => {
    setIsCreateOptionLoading(false);
    alert.onDialogOpen({ alertType: AlertType.Success, title: 'Option created!' });
  };

  const onCreateOptionFail = () => {
    setIsCreateOptionLoading(false);
    alert.onDialogOpen({
      alertType: AlertType.Failure,
      title: 'Option failed to create. Please try again later',
    });
  };

  const executeOption = useCallback((executeOptionData: ExecuteOption) => {
    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.EXECUTE_OPTION,
        data: { [TransactionEndpoints.EXECUTE_OPTION]: { ...executeOptionData } },
        callback: {
          onRequest: startExecuteOptionLoading,
          onFailure: onExecuteOptionFail,
          onSuccess: onExecuteOptionSuccess,
        },
      }),
    );
  }, []);

  const startExecuteOptionLoading = () => setIsCreateOptionLoading(true);

  const onExecuteOptionSuccess = () => {
    setIsCreateOptionLoading(false);
    alert.onDialogOpen({ alertType: AlertType.Success, title: 'Option executed!' });
  };

  const onExecuteOptionFail = () => {
    setIsCreateOptionLoading(false);
    alert.onDialogOpen({
      alertType: AlertType.Failure,
      title: 'Option failed to execute. Please try again later',
    });
  };

  const retrieveOption = useCallback((retrieveOptionData: RetrieveOption) => {
    dispatch(
      createSignSubmitTransactionRequest({
        endpoint: TransactionEndpoints.RETRIEVE_OPTION,
        data: { [TransactionEndpoints.RETRIEVE_OPTION]: { ...retrieveOptionData } },
        callback: {
          onRequest: startRetrieveOptionLoading,
          onFailure: onRetrieveOptionFail,
          onSuccess: onRetrieveOptionSuccess,
        },
      }),
    );
  }, []);

  const startRetrieveOptionLoading = () => setIsCreateOptionLoading(true);

  const onRetrieveOptionSuccess = () => {
    setIsCreateOptionLoading(false);
    alert.onDialogOpen({ alertType: AlertType.Success, title: 'Option retrieved!' });
  };

  const onRetrieveOptionFail = () => {
    setIsCreateOptionLoading(false);
    alert.onDialogOpen({
      alertType: AlertType.Failure,
      title: 'Option failed to retrieve. Please try again later',
    });
  };

  const [selectedOptionType, setSelectedOptionType] = useState(OptionType.Written);

  const writtenOptions = useMemo(() => {
    if (!pubKeyHashes) return [];
    return options?.filter((option) => isOptionOwned({ option, pubKeyHashes })) ?? [];
  }, [options, balance]);

  const ownedOptions = useMemo(() => {
    return options?.filter((option) => isOptionWritten({ option, balance })) ?? [];
  }, [options, pubKeyHashes]);

  const selectedOptions = useMemo(
    () => (selectedOptionType === OptionType.Written ? writtenOptions : ownedOptions),
    [selectedOptionType, writtenOptions, ownedOptions],
  );

  return (
    <OptionsContent.Wrapper>
      <OptionsContent.Container>
        <Stack minWidth="27.5rem">
          <OptionsCard isCreating={isCreateOptionLoading} onCreate={handleCreateOption} />
        </Stack>

        <Stack width="100%" minWidth={0}>
          {isWalletMockConnected && (
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6" fontWeight="bold">
                  My options
                </Typography>
                <PillSelect
                  value={selectedOptionType}
                  options={optionTypeOptions}
                  onChange={setSelectedOptionType}
                />
              </Stack>

              <OptionsTable
                options={selectedOptions}
                isLoading={isLoadingOptions}
                showExecuteButton={selectedOptionType === OptionType.Owned}
                showRetrieveButton={selectedOptionType === OptionType.Written}
                onExecute={handleExecuteOption}
                onRetrieve={handleRetrieveOption}
              />
            </Stack>
          )}
        </Stack>
      </OptionsContent.Container>
    </OptionsContent.Wrapper>
  );
};

OptionsContent.Wrapper = styled('div')`
  max-width: 100%;
  width: 100%;
  min-width: 0;
`;

OptionsContent.Container = styled('div')`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(4)};
  max-width: 100%;
  width: 100%;
  min-width: 0;
`;
