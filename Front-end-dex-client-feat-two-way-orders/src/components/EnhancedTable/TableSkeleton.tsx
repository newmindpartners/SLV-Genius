import { Grid, Skeleton as MuiSkeleton, styled } from '@mui/material';

export interface TableSkeletonProps {
  className?: string;
}

const TableSkeleton = ({ className }: TableSkeletonProps) => (
  <Wrapper
    container
    alignItems="center"
    flexDirection="column"
    gap="20px"
    className={className}
  >
    <Grid container>
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <TableRow key={index} container flexWrap="nowrap">
          <MuiSkeleton variant="rounded" width="39px" height="18px" className="first" />
          <MuiSkeleton variant="rounded" width="39px" height="18px" className="second" />
          <MuiSkeleton variant="rounded" width="48px" height="18px" className="third" />
          <MuiSkeleton variant="rounded" width="38px" height="18px" className="fourth" />
          <MuiSkeleton variant="rounded" width="48px" height="18px" className="fifth" />
          <MuiSkeleton variant="rounded" width="58px" height="18px" className="sixth" />
          <MuiSkeleton variant="rounded" width="118px" height="18px" className="sixth" />
        </TableRow>
      ))}
    </Grid>
  </Wrapper>
);

const Wrapper = styled(Grid)({
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

const TableRow = styled(Grid)({
  padding: '17px 27px 16px',
  backgroundColor: '#20273E',
  margin: '10px 0',
  borderRadius: '7px',

  '&:first-of-type': {
    borderRadius: '20px 20px 0 0',
  },

  '.first': {
    marginRight: '112px',
  },
  '.second': {
    marginRight: '175px',
  },
  '.third': {
    marginRight: '102px',
  },
  '.fourth': {
    marginRight: '91px',
  },
  '.fifth': {
    marginRight: '152px',
  },
  '.sixth': {
    marginRight: '88px',
  },
  '@media(max-width: 1300px)': {
    '.first': {
      marginRight: '70px',
    },
    '.second': {
      marginRight: '125px',
    },
    '.third': {
      marginRight: '60px',
    },
    '.fourth': {
      marginRight: '71px',
    },
    '.fifth': {
      marginRight: '122px',
    },
    '.sixth': {
      marginRight: '88px',
    },
  },
  '@media(max-width: 1120px)': {
    '.first': {
      marginRight: '40px',
    },
    '.second': {
      marginRight: '100px',
    },
    '.third': {
      marginRight: '40px',
    },
    '.fourth': {
      marginRight: '41px',
    },
    '.fifth': {
      marginRight: '80px',
    },
    '.sixth': {
      marginRight: '58px',
    },
  },
  '@media(max-width: 900px)': {
    '.first, .second, .third, .fourth, .fifth, .sixth': {
      marginRight: '40px',
    },
  },
  '@media(max-width: 760px)': {
    '.fifth, .sixth': {
      display: 'none',
    },
  },
  '@media(max-width: 450px)': {
    justifyContent: 'space-between',
    '.first, .second, .third, .fourth': {
      marginRight: 0,
    },
  },
});

export default TableSkeleton;
