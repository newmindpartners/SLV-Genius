import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Avatar,
  AvatarGroup,
  Grid,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Card } from '~/components/Card';
import { StatTypography } from '~/components/StatTypography';
import { TradingWalletAvatar } from '~/pages/Leaderboard/components/TradingWalletAvatar';
import { botsDataTooltip } from '~/pages/Leaderboard/constants';
import { formatPercentage } from '~/pages/Leaderboard/helpers/formatPercentage';
import { getTradingWalletProfile } from '~/pages/Leaderboard/helpers/getTradingWalletProfile';
import { TradingWallet } from '~/redux/api';
import { formatDuration } from '~/utils/dateUtils';
import { formatNumberWithPrecision } from '~/utils/math';
import { walletStakeKeyHashToStakeKeyBech32 } from '~/utils/wallet';

import { getRoiColor, proportionalToPercent } from '../../helpers/formatting';
import { TradingWalletDetailsSkeleton } from '../TradingWalletDetailsSkeleton';

export interface TradingWalletDetailsProps {
  data: TradingWallet | undefined;
  isLoading: boolean;
}

export const TradingWalletDetails = ({ data, isLoading }: TradingWalletDetailsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const tradingWalletProfile =
    data &&
    getTradingWalletProfile({
      assetOneId: data.assetOne.assetId,
      assetTwoId: data.assetTwo.assetId,
      tradingWalletStakeKeyHash: data.tradingWalletStakeKeyHash,
    });

  const handleCopyToClipboard = (text: string) => () => {
    navigator.clipboard.writeText(text).then(
      () => {
        enqueueSnackbar(`Copied to clipboard!`, {
          variant: 'success',
        });
      },
      () => {
        enqueueSnackbar(`Failed to copy to clipboard!`, {
          variant: 'error',
        });
      },
    );
  };

  if (isLoading) return <TradingWalletDetailsSkeleton />;
  if (!tradingWalletProfile || !data)
    return <Typography>Issue retrieving bot!</Typography>;

  const roiColor = getRoiColor(theme, data.roiPercent || 0);

  const formatTradingWalletStakeKeyHash = (stakeKeyBech32: string) =>
    `${stakeKeyBech32.slice(0, 10)}...${stakeKeyBech32.slice(-5)}`;

  const stakeKeyHashBech32: string | null = walletStakeKeyHashToStakeKeyBech32(
    data.tradingWalletStakeKeyHash,
    import.meta.env.VITE_CARDANO_NETWORK,
  );

  const stakeKeyUrl = data.stakeKeyUrl;

  return (
    <TradingWalletDetails.Wrapper>
      <TradingWalletDetails.Header>
        <TradingWalletAvatar
          src={tradingWalletProfile.avatar}
          size={isMobile ? '4rem' : '5rem'}
        />

        <Stack spacing={0.5} alignItems="flex-start">
          <Typography variant="h6" fontWeight={700}>
            {tradingWalletProfile.name}
          </Typography>

          {stakeKeyUrl && stakeKeyHashBech32 && (
            <Grid container item alignItems="center">
              <Typography
                variant="body3"
                fontWeight={400}
                color="#c1cef1"
                style={{ cursor: 'pointer' }}
                onClick={handleCopyToClipboard(stakeKeyHashBech32)}
              >
                {formatTradingWalletStakeKeyHash(stakeKeyHashBech32)}
              </Typography>
              <TradingWalletDetails.IconWrapper href={stakeKeyUrl} target="_blank">
                <ArrowForwardIcon />
              </TradingWalletDetails.IconWrapper>
            </Grid>
          )}

          <Grid container alignItems="center" gap={1}>
            <AvatarGroup>
              <TradingWalletDetails.Avatar src={data.assetOne.iconUrl} />
              <TradingWalletDetails.Avatar src={data.assetTwo.iconUrl} />
            </AvatarGroup>

            <Grid>
              {data.assetOne.shortName}/{data.assetTwo.shortName}
            </Grid>
          </Grid>
        </Stack>
      </TradingWalletDetails.Header>

      <TradingWalletDetails.StatGrid>
        <StatTypography label="ROI" color={roiColor} tooltip={botsDataTooltip}>
          {data.roiPercent
            ? formatPercentage(proportionalToPercent(data.roiPercent), true)
            : '-'}
        </StatTypography>
        <StatTypography label="Earned (ADA)">
          {data.earnedAdaAssetAmount
            ? formatNumberWithPrecision(Number(data.earnedAdaAssetAmount), 2)
            : '-'}
        </StatTypography>
        <StatTypography label="Runtime">
          {data.startDate ? formatDuration(new Date(data.startDate), new Date()) : '-'}
        </StatTypography>
      </TradingWalletDetails.StatGrid>
    </TradingWalletDetails.Wrapper>
  );
};

TradingWalletDetails.StatGrid = styled(Stack)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
  max-width: 40rem;
  width: 100%;
`;

TradingWalletDetails.Avatar = styled(Avatar)`
  border-color: #202740 !important;
  width: 2.2rem;
  height: 2.2rem;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

TradingWalletDetails.Header = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

TradingWalletDetails.Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(3)};
`;

TradingWalletDetails.IconWrapper = styled('a')`
  color: #4c54f5;
  margin-left: 5px;

  & svg {
    transform: rotate(-45deg) translate(-3px, 1px);
  }
`;
