import { Grid, Skeleton as MuiSkeleton, styled } from '@mui/material';

const OrderCardSkeleton = () => (
  <Wrapper>
    <Heading
      container
      flexWrap="nowrap"
      justifyContent="space-between"
      alignItems="center"
    >
      <MuiSkeleton variant="rounded" width="157px" height="28px" />
      <MuiSkeleton variant="rounded" width="98px" height="16px" />
    </Heading>
    <SkeletonContent container>
      <Grid container justifyContent="space-between" alignItems="center" mb="10px">
        <MuiSkeleton variant="rounded" width="96px" height="24px" />
        <MuiSkeleton
          variant="circular"
          width="28px"
          height="28px"
          className="muiSkeleton-circular"
        />
      </Grid>
      <Grid
        container
        gap="8px"
        justifyContent="space-between"
        alignItems="center"
        mb="28px"
      >
        <MuiSkeleton variant="rounded" width="100%" height="81px" />
        <MuiSkeleton variant="rounded" width="100%" height="81px" />
      </Grid>
      <Grid
        container
        gap="16px"
        justifyContent="space-between"
        alignItems="center"
        mb="26px"
      >
        <MuiSkeleton variant="rounded" width="100%" height="48px" />
        <MuiSkeleton variant="rounded" width="100%" height="26px" />
      </Grid>
      <Line mb="28px" height="1px" width="100%" />
      <Grid container gap="20px" justifyContent="space-between" alignItems="center">
        <MuiSkeleton variant="rounded" width="100%" height="24px" />
        <MuiSkeleton variant="rounded" width="100%" height="56px" />
      </Grid>
    </SkeletonContent>
  </Wrapper>
);

const Wrapper = styled(Grid)(({ theme }) => ({
  backgroundColor: '#20273E',
  borderRadius: '20px',
  width: '415px',

  'span.MuiSkeleton-root': {
    background: 'linear-gradient(102.36deg, #3A4970 0.35%, #323F62 103.41%)',
    borderRadius: '5px',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Heading = styled(Grid)({
  padding: '20px 28px',
  borderBottom: '1px solid #2D3758',
  borderRadius: '20px 20px 0px 0px',
});

const SkeletonContent = styled(Grid)({
  padding: '26px 28px 28px',
  paddingBottom: '33px',
  borderRadius: '0px 0px 20px 20px',
  '.muiSkeleton-circular': {
    borderRadius: '99px !important',
  },
});

const Line = styled(Grid)({
  backgroundColor: '#2D3758',
});

export default OrderCardSkeleton;
