import { Grid, Skeleton as MuiSkeleton, styled } from '@mui/material';

const CardSkeleton = () => (
  <Wrapper>
    <Grid container flexWrap="nowrap" flexDirection="column" gap="10px">
      <MuiSkeleton variant="rounded" width="70%" height="20px" />
      <MuiSkeleton variant="rounded" width="100%" height="68px" />
    </Grid>
    <SkeletonContent container>
      <Grid container>
        <MuiSkeleton variant="rounded" width="100%" height="150px" />
      </Grid>
      <Line height="1px" width="100%" />
      <Grid container gap="10px">
        <MuiSkeleton variant="rounded" width="70%" height="20px" />
        <MuiSkeleton variant="rounded" width="100%" height="36px" />
      </Grid>
      <Grid container gap="10px" mt="auto">
        <MuiSkeleton variant="rounded" width="100%" height="60px" />
        <MuiSkeleton variant="rounded" width="100%" height="60px" />
      </Grid>
    </SkeletonContent>
  </Wrapper>
);

const Wrapper = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#20273E',
  height: '100%',
  padding: '22px',
  background: 'linear-gradient(102.36deg, #3A4970 0.35%, #323F62 103.41%)',
  borderRadius: '29px',
  width: 'calc(33% - 8px)',
  gap: '24px',

  'span.MuiSkeleton-root': {
    borderRadius: '6px',
  },

  [theme.breakpoints.down('md')]: {
    height: '400px',
  },
}));

const SkeletonContent = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '24px',
  '.muiSkeleton-circular': {
    borderRadius: '99px !important',
  },
});

const Line = styled(Grid)({
  backgroundColor: '#2D3758',
});

export default CardSkeleton;
