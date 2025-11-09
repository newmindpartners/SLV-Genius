import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, styled } from '@mui/material';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '~/components/Button/Button';
import { Dialog, DialogTitle } from '~/components/Dialogs/Dialog';
import TextField from '~/components/TextField/TextField';
import { Asset } from '~/redux/api';
import { TradingAsset } from '~/utils/tradingPairsUtils';
import { convertStringToStakeKeyHash } from '~/utils/wallet';

import { TradingWalletAvatar } from '../../components/TradingWalletAvatar';
import {
  getTradingWalletProfile,
  TradingWalletProfile,
} from '../../helpers/getTradingWalletProfile';
import { CurrencyPicker } from './components/CurrencyPicker';
import { FormCurrencyPicker } from './components/FormCurrencyPicker';
import { registerBotFormSchema } from './schemas/registerBotFormSchema';
import { IRegisterBotFormData } from './types/IRegisterBotFormData';

export interface RegisterBotDialogProps {
  open: boolean;
  data?: IRegisterBotFormData;
  isSuccess?: boolean;
  assetOne: TradingAsset;
  assetTwoOptions: Asset[];
  isLoading: boolean;
  onClose: () => void;
  onRegister: (data: IRegisterBotFormData) => void;
}

export const RegisterBotDialog = ({
  open,
  assetOne,
  assetTwoOptions,
  isLoading,
  onClose,
  onRegister,
}: RegisterBotDialogProps) => {
  const [tradingWalletProfile, setTradingWalletProfile] =
    useState<TradingWalletProfile | null>(null);

  const {
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterBotFormData>({
    defaultValues: {
      tradingWalletStakeKeyHash: '',
      assetTwoId: '',
    },
    resolver: zodResolver(registerBotFormSchema),
  });

  const handleChange = useCallback(() => {
    const tradingWalletAddressInput = getValues('tradingWalletStakeKeyHash');

    const stakeKeyHashFromStakeKeyBech32 = convertStringToStakeKeyHash(
      tradingWalletAddressInput,
    );

    const assetTwoId = getValues('assetTwoId');

    if (!assetTwoId || !stakeKeyHashFromStakeKeyBech32) return;

    const profile = getTradingWalletProfile({
      tradingWalletStakeKeyHash: stakeKeyHashFromStakeKeyBech32 || '',
      assetOneId: assetOne.assetId,
      assetTwoId,
    });

    setTradingWalletProfile(profile);
  }, [assetOne]);

  const handleChangeDebounced = useMemo(
    () => debounce(handleChange, 500),
    [handleChange],
  );

  const assetOneCurrency = useMemo(
    () => ({
      id: assetOne.assetId,
      icon: assetOne.iconUrl,
      name: assetOne.shortName,
    }),
    [assetOne],
  );

  const assetTwoCurrencyOptions = useMemo(
    () =>
      assetTwoOptions.map((asset) => ({
        id: asset.assetId,
        icon: asset.iconUrl,
        name: asset.shortName,
      })),
    [assetTwoOptions],
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle title="Register bot" onClose={onClose} />

      <Stack spacing={4}>
        <Stack spacing={2}>
          <Stack alignItems="center" justifyContent="center">
            <TradingWalletAvatar src={tradingWalletProfile?.avatar} size="5rem" />
          </Stack>

          <TextField
            color="secondary"
            caption="Bot stake key:"
            placeholder="Enter wallet stake key"
            error={!!errors.tradingWalletStakeKeyHash}
            helperText={errors.tradingWalletStakeKeyHash?.message}
            {...register('tradingWalletStakeKeyHash', {
              onChange: handleChangeDebounced,
            })}
          />

          <TextField
            disabled
            color="secondary"
            bgcolor="secondary"
            caption="Bot name:"
            placeholder="Generated based on stake key and asset pair"
            value={tradingWalletProfile?.name}
          />

          <CurrencyPicker
            disabled
            color="secondary"
            caption="Asset one:"
            placeholder="Select asset"
            value={assetOneCurrency}
          />

          <FormCurrencyPicker
            name="assetTwoId"
            control={control}
            bgcolor="secondary"
            color="secondary"
            caption="Asset two:"
            placeholder="Select asset"
            error={!!errors.assetTwoId}
            helperText={errors.assetTwoId?.message}
            options={assetTwoCurrencyOptions}
            onChange={handleChange}
          />
        </Stack>

        <Button
          color="gradient"
          sx={{ fontWeight: 'bold' }}
          loading={isLoading}
          onClick={handleSubmit(onRegister)}
        >
          Register
        </Button>
      </Stack>
    </Dialog>
  );
};

RegisterBotDialog.Links = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;
