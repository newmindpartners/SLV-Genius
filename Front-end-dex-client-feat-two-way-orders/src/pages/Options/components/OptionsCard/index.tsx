import { zodResolver } from '@hookform/resolvers/zod';
import { InputAdornment, Stack, styled, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import Button from '~/components/Button/Button';
import { Card } from '~/components/Card';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import TextField from '~/components/TextField/TextField';
import { useWallet } from '~/hooks/wallet/wallet';
import { ICurrency } from '~/pages/Leaderboard/dialogs/RegisterBotDialog/components/CurrencyPicker';
import { FormCurrencyPicker } from '~/pages/Leaderboard/dialogs/RegisterBotDialog/components/FormCurrencyPicker';
import GreyDivider from '~/pages/Swap/components/Dialogs/AdvancedSettingsDialog/GreyDivider';

import { knownTokens } from '../../mock/knownTokens';
import { IOptionsFormData, optionsSchema } from '../../schemas/optionsSchema';
import { FormDateTimeField } from '../FormDateTimeField';

export interface OptionsCardOptions {
  isCreating: boolean;
  onCreate: (data: IOptionsFormData) => void;
}

export const OptionsCard = ({ isCreating, onCreate }: OptionsCardOptions) => {
  const { isWalletConnected } = useWallet();

  const {
    control,
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<IOptionsFormData>({
    resolver: zodResolver(optionsSchema),
  });

  const currencyOptions: ICurrency[] =
    knownTokens.map((token) => ({
      id: token.assetId,
      icon: token.logo,
      name: token.ticker,
    })) ?? [];

  return (
    <form onSubmit={handleSubmit(onCreate)} autoComplete="off">
      <OptionsCard.Wrapper>
        <OptionsCard.Header>
          <Typography variant="h6" fontWeight="bold">
            Options
          </Typography>
        </OptionsCard.Header>

        <OptionsCard.Container>
          <Stack spacing={2}>
            <FormDateTimeField
              clearable
              name="endDate"
              control={control}
              color="secondary"
              caption="End date"
              ampm={false}
              format="dd.MM.yyyy HH:mm"
            />

            <FormCurrencyPicker
              name="deposit"
              control={control}
              caption="From"
              placeholder="Select asset"
              color="secondary"
              options={currencyOptions}
            />

            <FormCurrencyPicker
              name="payment"
              control={control}
              caption="To"
              placeholder="Select asset"
              color="secondary"
              options={currencyOptions}
            />

            <TextField
              caption="Exercise Price"
              placeholder="Enter price"
              color="secondary"
              InputProps={{
                endAdornment: <InputAdornment position="end">{}</InputAdornment>,
              }}
              {...register('price')}
            />

            <TextField
              caption="Amount"
              placeholder="Enter amount"
              color="secondary"
              {...register('amount')}
            />
          </Stack>

          <GreyDivider />

          {isWalletConnected ? (
            <Button
              fullWidth
              loading={isCreating}
              disabled={!isValid}
              type="submit"
              color="gradient"
            >
              Create Option
            </Button>
          ) : (
            <ConnectWalletButtonDialog fullWidth color="gradient" />
          )}
        </OptionsCard.Container>
      </OptionsCard.Wrapper>
    </form>
  );
};

OptionsCard.Header = styled('div')`
  padding-left: ${({ theme }) => theme.spacing(3)};
  padding-right: ${({ theme }) => theme.spacing(3)};
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

OptionsCard.Container = styled('div')`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(3)};
  gap: ${({ theme }) => theme.spacing(3)};
`;

OptionsCard.Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
`;
