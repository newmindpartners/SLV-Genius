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
import Button from '~/components/Button/Button';
import { Card } from '~/components/Card';
import { StatTypography } from '~/components/StatTypography';
import {
  getRoiColor,
  proportionalToPercent,
} from '~/pages/TradingWallet/helpers/formatting';
import { TradingWallet } from '~/redux/api';
import { formatDuration } from '~/utils/dateUtils';
import { formatNumberWithPrecision } from '~/utils/math';

import { botsDataTooltip } from '../../constants';
import { formatPercentage } from '../../helpers/formatPercentage';
import { getTradingWalletProfile } from '../../helpers/getTradingWalletProfile';
import { PreviewChart } from '../PreviewChart';
import { TradingWalletAvatar } from '../TradingWalletAvatar';

export interface TradingWalletCardProps {
  data: TradingWallet;
  place?: number;
  onViewTradingWallet?: () => void;
}

export const TradingWalletCard = ({
  data,
  place,
  onViewTradingWallet,
}: TradingWalletCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const roiColor = getRoiColor(theme, data.roiPercent || 0);

  const tradingWalletProfile = getTradingWalletProfile({
    assetOneId: data.assetOne.assetId,
    assetTwoId: data.assetTwo.assetId,
    tradingWalletStakeKeyHash: data.tradingWalletStakeKeyHash,
  });

  const roiChartData = data.profitabilityHistory.map((item) => ({
    time: item.timestamp,
    ...(item.roiPercent ? { value: proportionalToPercent(item.roiPercent) } : {}),
  }));

  return (
    <TradingWalletCard.Wrapper>
      <TradingWalletCard.Header>
        <TradingWalletAvatar
          src={tradingWalletProfile.avatar}
          place={place}
          size={isMobile ? '4rem' : '5rem'}
        />

        <Stack spacing={1} alignItems="flex-start">
          <Typography variant="h6" fontWeight={700}>
            {tradingWalletProfile.name}
          </Typography>

          <Grid container alignItems="center" gap={1}>
            <AvatarGroup>
              <TradingWalletCard.Avatar src={data.assetOne.iconUrl} />
              <TradingWalletCard.Avatar src={data.assetTwo.iconUrl} />
            </AvatarGroup>

            <Grid>
              {data.assetOne.shortName}/{data.assetTwo.shortName}
            </Grid>
          </Grid>
        </Stack>
      </TradingWalletCard.Header>

      <TradingWalletCard.Main>
        <StatTypography
          label="ROI"
          color={roiColor}
          variant="h5"
          tooltip={botsDataTooltip}
        >
          {data.roiPercent
            ? formatPercentage(proportionalToPercent(data.roiPercent), true)
            : '-'}
        </StatTypography>

        <TradingWalletCard.Chart>
          <PreviewChart color={roiColor} data={roiChartData} />
        </TradingWalletCard.Chart>
      </TradingWalletCard.Main>

      <TradingWalletCard.Footer>
        <Stack direction="row" spacing={1.7}>
          <StatTypography label="Earned (ADA)" variant="body1" fontSize="16px">
            {data.earnedAdaAssetAmount
              ? formatNumberWithPrecision(Number(data.earnedAdaAssetAmount), 2)
              : '-'}
          </StatTypography>
          <StatTypography label="Runtime" variant="body1" fontSize="16px">
            {data.startDate ? formatDuration(new Date(data.startDate), new Date()) : '-'}
          </StatTypography>
        </Stack>

        <TradingWalletCard.Button
          color="gradient"
          size="small"
          onClick={onViewTradingWallet}
        >
          View Bot
        </TradingWalletCard.Button>
      </TradingWalletCard.Footer>
    </TradingWalletCard.Wrapper>
  );
};

TradingWalletCard.Button = styled(Button)`
  padding: 15px 20px;
  font-size: 14px;
`;

TradingWalletCard.Avatar = styled(Avatar)`
  border-color: #202740 !important;
  height: 2rem;
  width: 2rem;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 1.75rem;
    width: 1.75rem;
  }
`;

TradingWalletCard.Chart = styled('div')`
  width: 10rem;
  height: 5rem;

  transform: translateX(13px);
`;

TradingWalletCard.Main = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

TradingWalletCard.Footer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

TradingWalletCard.Header = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

TradingWalletCard.Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: 1rem;
`;
