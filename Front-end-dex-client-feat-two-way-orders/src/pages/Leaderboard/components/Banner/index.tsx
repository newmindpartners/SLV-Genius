import { Stack, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import Button from '~/components/Button/Button';
import { Card } from '~/components/Card';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import { useWallet } from '~/hooks/wallet/wallet';

export interface BannerProps {
  isWalletConnected: boolean;
  onRegisterBot: () => void;
}

export const Banner = ({ onRegisterBot }: BannerProps) => {
  const theme = useTheme();
  const { isWalletConnected } = useWallet();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Banner.Wrapper>
      <Stack spacing={1} zIndex={1}>
        <Typography variant={isMobile ? 'h2' : 'h1'} component="h1" fontWeight={1000}>
          Trading Bot Analytics
        </Typography>

        <Typography variant="body2" color="#c1cef1">
          Register a bot to analyse the profitability of trades made by a wallet
        </Typography>
      </Stack>

      {isWalletConnected ? (
        <Button
          color="gradient"
          sx={{ fontWeight: 'bold', px: 4, zIndex: 1 }}
          onClick={onRegisterBot}
        >
          Register Bot
        </Button>
      ) : (
        <ConnectWalletButtonDialog
          label="Connect Your Wallet"
          size="medium"
          showWalletAddressIfConnected={false}
        />
      )}

      {!isMobile && (
        <Banner.BotImage src="/images/trading-wallet/competition-banner-trading-wallet.png" />
      )}
    </Banner.Wrapper>
  );
};

Banner.BotImage = styled('img')`
  height: 18.5rem;
  object-fit: contain;
  position: absolute;
  user-select: none;
  pointer-events: none;
  bottom: 0;
  right: 2rem;
`;

Banner.Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background: url('/images/trading-wallet/competition-banner-background.png') no-repeat
    center;
  background-size: cover;
  position: relative;
  overflow: visible;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => `${theme.spacing(6)} ${theme.spacing(4)}`};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;
