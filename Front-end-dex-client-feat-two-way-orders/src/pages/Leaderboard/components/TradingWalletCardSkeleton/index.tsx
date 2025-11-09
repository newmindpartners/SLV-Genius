import { Skeleton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { StatTypography } from '~/components/StatTypography';

import { TradingWalletCard } from '../TradingWalletCard';

export const TradingWalletCardSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TradingWalletCard.Wrapper>
      <TradingWalletCard.Header>
        <Skeleton
          variant="circular"
          width={isMobile ? '4rem' : '5rem'}
          height={isMobile ? '4rem' : '5rem'}
        />
        <Typography variant="h6">
          <Skeleton width="10rem" />
        </Typography>
      </TradingWalletCard.Header>

      <TradingWalletCard.Main>
        <StatTypography label="ROI" variant="h6">
          <Skeleton width="5rem" />
        </StatTypography>
      </TradingWalletCard.Main>

      <TradingWalletCard.Footer>
        <Stack direction="row" spacing={2}>
          <StatTypography label="Earned">
            <Skeleton width="5rem" />
          </StatTypography>
          <StatTypography label="Runtime">
            <Skeleton width="5rem" />
          </StatTypography>
        </Stack>
      </TradingWalletCard.Footer>
    </TradingWalletCard.Wrapper>
  );
};
