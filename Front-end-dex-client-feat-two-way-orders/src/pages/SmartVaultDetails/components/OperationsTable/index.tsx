import { Grid } from '@mui/material';
import { useState } from 'react';
import EnhancedTable from '~/components/EnhancedTable';
import { RowWithSubrows } from '~/components/Table';
import EmptyTableScreen from '~/pages/Explore/components/EmptyTableScreen';

import { smartVaultDetailsTableHeadlines } from '../../mocks';

export interface OperationsTableProps {
  operations: RowWithSubrows[];
  isLoading: boolean;
  isInitialLoading: boolean;
}

const OperationsTable = ({
  isLoading,
  isInitialLoading,
  operations,
}: OperationsTableProps) => {
  const [expandedRowId, setExpandedRowId] = useState<string | number | null>(null);

  if (!isLoading && !isInitialLoading && !operations.length) {
    return (
      <EmptyTableScreen
        title="No operations exist"
        description="Smart vault has not yet made any operations"
      />
    );
  }

  return (
    <Grid container direction="column" rowGap="20px">
      <EnhancedTable
        orders={operations}
        headlines={smartVaultDetailsTableHeadlines}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        expandedRowId={expandedRowId}
        setExpandedRowId={setExpandedRowId}
      />
    </Grid>
  );
};

export default OperationsTable;
