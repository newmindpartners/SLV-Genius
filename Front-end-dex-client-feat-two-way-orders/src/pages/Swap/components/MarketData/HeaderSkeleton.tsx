import { Grid, keyframes, Skeleton as MuiSkeleton, styled } from '@mui/material';

const animation = keyframes`
  0% {
    background: #252535;
  } 
  50% {
    background: #141425;
  }
  100% {
    background: #252535;
  }
`;

const HeaderSkeleton = () => (
  <Grid container direction="column" flex={1} width="100%">
    <Grid container item justifyContent="space-between" alignItems="flex-end">
      <Grid container item gap="7px" width="100%" direction="row">
        <FirstColumn container item width="95px">
          <MuiSkeleton variant="circular" width="56px" height="56px" />
          <TradingPairSkeleton variant="circular" width="56px" height="56px" />
        </FirstColumn>
        <Grid container item gap="12px" alignItems="flex-end" width="200px">
          <Grid container item flexDirection="column" gap="7px">
            <MuiSkeleton variant="rounded" width="107px" height="14px" />
            <MuiSkeleton variant="rounded" width="120px" height="36px" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

const TradingPairSkeleton = styled(MuiSkeleton)({
  border: '2.5px #141E2B solid',
  zIndex: '1000',
  background: '#252535',
  animation: `${animation} 2s ease-in-out 0.5s infinite`,
});

const FirstColumn = styled(Grid)({
  'span:last-child': {
    marginLeft: '-17px',
  },
});

export default HeaderSkeleton;
