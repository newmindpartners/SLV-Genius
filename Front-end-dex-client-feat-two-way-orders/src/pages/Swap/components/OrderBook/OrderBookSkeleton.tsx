import { Grid, Skeleton as MuiSkeleton, styled } from '@mui/material';

const OrderBookSkeleton = () => (
  <Wrapper container alignItems="center" flexDirection="column" gap="20px">
    <TableWrapper minHeight="228px">
      {[1, 2, 3, 4].map((_, index) => (
        <TableRow key={index}>
          <MuiSkeleton variant="rounded" width="150px" height="22px" className="first" />
          <MuiSkeleton variant="rounded" width="140px" height="22px" className="second" />
          <MuiSkeleton variant="rounded" width="153px" height="22px" className="third" />
        </TableRow>
      ))}
    </TableWrapper>

    <PriceWrapper>
      <MuiSkeleton variant="rounded" width="100%" height="48px" />
    </PriceWrapper>

    <TableWrapper>
      {[1, 2, 3, 4].map((_, index) => (
        <TableRow key={index}>
          <MuiSkeleton variant="rounded" width="150px" height="22px" className="first" />
          <MuiSkeleton variant="rounded" width="140px" height="22px" className="second" />
          <MuiSkeleton variant="rounded" width="153px" height="22px" className="third" />
        </TableRow>
      ))}
    </TableWrapper>
  </Wrapper>
);

const PriceWrapper = styled(Grid)({
  margin: '10px 0',
  width: '100%',
});

const TableWrapper = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  width: '100%',
});

const Wrapper = styled(Grid)({
  paddingTop: '8px',

  'span.MuiSkeleton-root': {
    background: 'linear-gradient(102.36deg, #3A4970 0.35%, #323F62 103.41%)',
    borderRadius: '5px',
  },
  '@media(max-width: 450px)': {
    '.headingFirst, .headingSecond': {
      width: '60px !important',
    },
  },
});

const TableRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '7px',
  gap: '4px',

  '&:first-of-type': {
    borderRadius: '20px 20px 0 0',
  },
});

export default OrderBookSkeleton;
