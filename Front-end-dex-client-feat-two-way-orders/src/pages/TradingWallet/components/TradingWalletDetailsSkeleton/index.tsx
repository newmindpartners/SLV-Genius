import { Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { StatTypography } from '~/components/StatTypography';

import { TradingWalletDetails } from '../TradingWalletDetails';

export const TradingWalletDetailsSkeleton = () => {
  const theme = useTheme();
  const isMobile = theme.breakpoints.down('sm');

  return (
    <TradingWalletDetails.Wrapper>
      <TradingWalletDetails.Header>
        <Skeleton
          variant="circular"
          width={isMobile ? '4rem' : '5rem'}
          height={isMobile ? '4rem' : '5rem'}
        />
        <Stack spacing={1} alignItems="flex-start">
          <Typography variant="h6" fontWeight={700}>
            <Skeleton width="10rem" />
          </Typography>
        </Stack>
      </TradingWalletDetails.Header>

      <TradingWalletDetails.StatGrid>
        <StatTypography label="ROI">
          <Skeleton width="5rem" />
        </StatTypography>
        <StatTypography label="Earned">
          <Skeleton width="5rem" />
        </StatTypography>
        <StatTypography label="Runtime">-</StatTypography>
      </TradingWalletDetails.StatGrid>
    </TradingWalletDetails.Wrapper>
  );
};
