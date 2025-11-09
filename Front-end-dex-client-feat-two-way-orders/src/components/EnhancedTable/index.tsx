import { Grid } from '@mui/material';
import { FC, ReactElement } from 'react';
import { Headline, RowWithSubrows } from '~/components/Table';
import { SortState } from '~/hooks/swap/list-orders/useSwapListOrdersSorted';

import TableSkeleton from './TableSkeleton';
import TableWithLoading from './TableWithLoading';

type EnhancedTableProps = {
  orders: RowWithSubrows[];
  headlines: Headline[];
  isInitialLoading: boolean;
  isLoading?: boolean;

  sortState?: SortState;
  expandedRowId?: number | string | null;
  hideFeeColumn?: boolean;

  handleSortChange?: (content: string) => void;
  setExpandedRowId?: (id: number | string | null) => void;
  onRowClick?: (rowId: number | string) => void;
};

const EnhancedTable: FC<EnhancedTableProps> = ({
  orders,
  headlines,
  isInitialLoading,
  isLoading,

  sortState,
  expandedRowId,

  handleSortChange,
  setExpandedRowId,
  onRowClick,
}): ReactElement => (
  <Grid container direction="column">
    {isInitialLoading ? (
      <TableSkeleton />
    ) : (
      <TableWithLoading
        headlines={headlines}
        rows={orders}
        expandedRowId={expandedRowId}
        setExpandedRowId={setExpandedRowId}
        sortState={sortState}
        handleSortChange={handleSortChange}
        isLoading={isLoading}
        onRowClick={onRowClick}
      />
    )}
  </Grid>
);

export default EnhancedTable;
