import { Grid } from '@mui/material';

import PaginationButton from './PaginationButton';

type TablePaginationProps = {
  isLoading: boolean;

  hasNextPage: boolean;
  goToNextPage: () => void;

  hasPreviousPage: boolean;
  goToPreviousPage: () => void;
};

const TablePagination = ({
  isLoading,

  hasNextPage,
  goToNextPage,

  hasPreviousPage,
  goToPreviousPage,
}: TablePaginationProps) => (
  <Grid container justifyContent="space-between" mt="20px">
    <PaginationButton
      disabled={!hasPreviousPage}
      isLoading={isLoading}
      onClick={goToPreviousPage}
    >
      Previous Page
    </PaginationButton>
    <PaginationButton
      disabled={!hasNextPage}
      isLoading={isLoading}
      onClick={goToNextPage}
    >
      Next Page
    </PaginationButton>
  </Grid>
);

export default TablePagination;
