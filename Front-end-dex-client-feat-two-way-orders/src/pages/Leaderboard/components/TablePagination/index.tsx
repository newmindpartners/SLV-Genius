import { styled } from '@mui/material';
import Button from '~/components/Button/Button';

export interface TablePaginationProps {
  isPrevPageLoading?: boolean;
  isNextPageLoading?: boolean;
  isPrevPageDisabled?: boolean;
  isNextPageDisabled?: boolean;
  onPrevPage?: () => void;
  onNextPage?: () => void;
}

export const TablePagination = ({
  isPrevPageLoading,
  isNextPageLoading,
  isPrevPageDisabled,
  isNextPageDisabled,
  onPrevPage,
  onNextPage,
}: TablePaginationProps) => (
  <TablePagination.Wrapper>
    <Button
      color="transparent"
      disabled={isPrevPageDisabled}
      loading={isPrevPageLoading}
      onClick={onPrevPage}
    >
      Previous Page
    </Button>
    <Button
      color="transparent"
      disabled={isNextPageDisabled}
      loading={isNextPageLoading}
      onClick={onNextPage}
    >
      Next Page
    </Button>
  </TablePagination.Wrapper>
);

TablePagination.Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;
