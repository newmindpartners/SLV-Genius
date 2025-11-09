import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import {
  CreateStakeVault,
  StakeVaultData,
  useGetStakeVaultCreateRewardsEstimateMutation,
} from '~/redux/api';
import { parseApiErrorToMessage } from '~/utils/errorHandlingUtils';

import { useWallet } from '../../../hooks/wallet/wallet';

const useStakeVaultRewards = () => {
  const {
    getWalletChangeAddress,
    getWalletUsedAddresses,
    getWalletUnusedAddresses,
    getWalletCollateralUtxo,
  } = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  const [getStakeVaultRewards, stakeVaultRewards] =
    useGetStakeVaultCreateRewardsEstimateMutation();

  const [isLoading, setIsLoading] = useState(false);

  const fetchStakeVaultRewardsDebounced = useCallback(
    debounce(async (stakeVault: StakeVaultData) => {
      const [walletAddress, walletUsedAddresses, walletUnusedAddresses, collateralUtxo] =
        await Promise.all([
          getWalletChangeAddress(),
          getWalletUsedAddresses(),
          getWalletUnusedAddresses(),
          getWalletCollateralUtxo(),
        ]);

      if (walletAddress) {
        const createStakeVaultData: CreateStakeVault = {
          ...stakeVault,
          walletAddress,
          walletUnusedAddresses,
          walletUsedAddresses,
          collateralUtxo,
        };

        getStakeVaultRewards({
          createStakeVault: createStakeVaultData,
        });
      }
    }, 350),
    [],
  );

  const fetchStakeVaultRewards = (stakeVault: StakeVaultData) => {
    startDialogLoading();
    fetchStakeVaultRewardsDebounced(stakeVault);
  };

  const fetchStakeVaultRewardsFailure = useCallback((message?: string) => {
    endDialogLoading();
    enqueueSnackbar(message, {
      variant: 'error',
    });
  }, []);

  const fetchStakeVaultRewardsSuccess = useCallback(() => {
    endDialogLoading();
  }, []);

  const startDialogLoading = useCallback(() => setIsLoading(true), [isLoading]);

  const endDialogLoading = useCallback(() => setIsLoading(false), [isLoading]);

  useEffect(() => {
    if (stakeVaultRewards.isError) {
      const errorMessage = parseApiErrorToMessage(stakeVaultRewards.error);
      fetchStakeVaultRewardsFailure(errorMessage);
    } else if (stakeVaultRewards.isSuccess) {
      fetchStakeVaultRewardsSuccess();
    }
  }, [stakeVaultRewards]);

  return { stakeVaultRewards, fetchStakeVaultRewards, isLoading };
};

export default useStakeVaultRewards;
