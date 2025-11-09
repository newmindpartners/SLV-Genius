import { Grid, styled, Typography } from '@mui/material';
import Big from 'big.js';
import { FC, ReactElement } from 'react';
import Button from '~/components/Button/Button';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { isLessOrEqual, isValidBig, minus, times } from '~/utils/mathUtils';
import { isAssetADA } from '~/utils/swapOrderUtils';
import { TradingAsset } from '~/utils/tradingPairsUtils';

import useSwapFromAssetWalletBalance from '../hooks/order-card/wallet-balance/useSwapFromAssetWalletBalance';

type AvailableInputPercentageProps = {
  handleChangeAmount: (amount: string) => void;
};

const SAFETY_BUFFER_ADA_AMOUNT = 10;
const SAFETY_BUFFER_FEE_PERCENTAGE = 0.003; // 0.3%

const AvailableInputPercentage: FC<AvailableInputPercentageProps> = ({
  handleChangeAmount,
}): ReactElement => {
  const { selectedFromAssetBalance } = useSwapFromAssetWalletBalance();
  const { selectedAssets } = useTradingPairs();

  const availableValue =
    selectedFromAssetBalance && selectedAssets.from
      ? applyFeeBuffer(applyADABuffer(selectedFromAssetBalance, selectedAssets.from))
      : '0';

  const handleSelectMax = () => {
    handleChangeAmount(availableValue.toString());
  };

  const formattedSelectedFromAssetBalance =
    selectedFromAssetBalance && isValidBig(selectedFromAssetBalance)
      ? new Big(selectedFromAssetBalance).toFixed(2)
      : selectedFromAssetBalance;

  return (
    <Grid
      display="flex"
      flexWrap="nowrap"
      justifyContent="space-end"
      alignItems="center"
      gap="5px"
    >
      <Grid display="flex" gap="3px">
        <Typography
          variant="poweredBy"
          lineHeight="16px"
          fontWeight="500"
          color="buttonsInactive.dark"
        >
          Available:
        </Typography>

        <Typography
          variant="poweredBy"
          lineHeight="16px"
          fontWeight="500"
          color="buttonsInactive.dark"
        >
          {formattedSelectedFromAssetBalance}
        </Typography>
      </Grid>

      <Grid
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        width="100%"
        flexWrap="nowrap"
      >
        <PercentItem onClick={handleSelectMax}>
          <Typography variant="poweredBy" fontWeight="600" color="#4C54F5">
            MAX
          </Typography>
        </PercentItem>
      </Grid>
    </Grid>
  );
};

const fallbackBalanceToZero = (balance: string): string =>
  isLessOrEqual(balance, 0) ? '0' : balance;

const applyADABuffer = (balance: string, tradingAssetsFrom: TradingAsset) => {
  const isBalanceValid = isValidBig(balance);

  if (isBalanceValid && isAssetADA(tradingAssetsFrom.shortName)) {
    const reservedAdaAmount = SAFETY_BUFFER_ADA_AMOUNT;

    return fallbackBalanceToZero(minus(balance, reservedAdaAmount));
  }

  return balance;
};

const applyFeeBuffer = (balance: string) => {
  const isBalanceValid = isValidBig(balance);

  if (isBalanceValid) {
    const reservedFeeAmount = times(balance, SAFETY_BUFFER_FEE_PERCENTAGE);

    return fallbackBalanceToZero(minus(balance, reservedFeeAmount));
  }

  return balance;
};

const PercentItem = styled(Button)(({ theme }) => ({
  cursor: 'pointer',
  backgroundColor: 'transparent',
  padding: '0 5px',
  borderRadius: theme.borderRadius.xs,
  width: 'fit-content',
  minWidth: 'fit-content',
  height: '20px',

  '& .MuiTypography-root': {
    color: '#4C54F5',
  },

  '&:hover': {
    background: '#4C54F5',
    boxShadow: 'none',

    '& .MuiTypography-root': {
      color: theme.palette.textColor.light,
    },
  },

  [theme.breakpoints.down('lg')]: {
    padding: '0 5px',
  },
}));

export default AvailableInputPercentage;
