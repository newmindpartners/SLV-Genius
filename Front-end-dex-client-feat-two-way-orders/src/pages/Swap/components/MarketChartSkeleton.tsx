import { Grid, Skeleton as MuiSkeleton } from '@mui/material';

const MarketChartSkeleton = () => (
  <Grid container direction="column" height="100%" flex={1} width="100%">
    <Grid container alignItems="center" justifyContent="center" height="30rem">
      <Grid container gap="12px" alignItems="flex-end" justifyContent="center">
        <MuiSkeleton variant="rounded" width="12px" height="44px" />
        <MuiSkeleton variant="rounded" width="12px" height="64px" />
        <MuiSkeleton variant="rounded" width="12px" height="84px" />
        <MuiSkeleton variant="rounded" width="12px" height="64px" />
        <MuiSkeleton variant="rounded" width="12px" height="44px" />
      </Grid>
    </Grid>
  </Grid>
);

export default MarketChartSkeleton;
