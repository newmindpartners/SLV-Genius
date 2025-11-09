import { Chip, Grid, styled, Typography } from '@mui/material';
import { FC, useCallback } from 'react';
import { CircularLoader } from '~/components/CircularProgress/CircularLoader';
import { ErrorIcon } from '~/components/Icons';
import { Info } from '~/components/Icons/Icons';
import WalletIcon from '~/components/Icons/WalletIcon';
import Tooltip from '~/components/Tooltip';
import { useWallet } from '~/hooks/wallet/wallet';
import { WalletType } from '~/types/wallet';

type WalletItemProps = {
  walletType: WalletType;
  isLoading?: boolean;
  isNotInstalled?: boolean;
  isDisabled?: boolean;
  isVisible?: boolean;
  warning?: string;
  error?: string;
  onClick: (walletType: WalletType) => void;
};

const ICON_SIZE = 40;

const WalletItem: FC<WalletItemProps> = ({
  isLoading,
  walletType,
  isDisabled,
  isVisible = true,
  isNotInstalled,
  warning,
  error,
  onClick,
}) => {
  const { wallets } = useWallet();
  const onWalletTypeClick = useCallback(() => {
    onClick(walletType);
  }, [onClick, walletType]);

  if (!isVisible) return null;

  return (
    <WalletItemWrapper disabled={isDisabled} onClick={onWalletTypeClick}>
      <Grid
        container
        alignItems={'center'}
        justifyContent={'space-between'}
        wrap="nowrap"
      >
        <Grid container item alignItems="center">
          <Typography variant={'body3'} color={'textColor.main'}>
            {wallets[walletType].title}
          </Typography>
          {isNotInstalled && <Chip label="Not installed" sx={{ marginLeft: 1 }} />}
          {error && (
            <Tooltip title={error}>
              <IconWrapper sx={{ marginLeft: 1 }}>
                <ErrorIcon />
              </IconWrapper>
            </Tooltip>
          )}
          {warning && (
            <Tooltip title={warning}>
              <IconWrapper sx={{ marginLeft: 1 }}>
                <Info />
              </IconWrapper>
            </Tooltip>
          )}
        </Grid>
        <CircularLoader
          isLoading={!!isLoading}
          circularProgressProps={{ color: 'primary', size: ICON_SIZE }}
        >
          <Grid item>
            <WalletIcon walletType={walletType} />
          </Grid>
        </CircularLoader>
      </Grid>
    </WalletItemWrapper>
  );
};

const IconWrapper = styled(Grid)({
  '& > svg': {
    display: 'block',
  },
});

const WalletItemWrapper = styled('button')(({ theme }) => ({
  padding: '12px 30px',
  background: theme.palette.bgCardColor.main,
  borderRadius: theme.borderRadius.sm,
  cursor: 'pointer',
  border: `2px solid transparent`,
  width: '100%',
  transitionDuration: '0.4s',

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',

    '&:hover': {
      borderColor: 'transparent',
    },
  },

  '&:hover': {
    borderColor: theme.palette.progressRedGradient.main,
  },

  img: {
    height: `${ICON_SIZE}px`,
    width: `${ICON_SIZE}px`,
  },
}));

export default WalletItem;
