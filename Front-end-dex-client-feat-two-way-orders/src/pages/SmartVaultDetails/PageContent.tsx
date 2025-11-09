import { ChevronLeft } from '@mui/icons-material';
import { Grid, Stack, styled, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '~/components/Button/Button';
import EnhancedTableContainer from '~/components/EnhancedTable';
import TablePagination from '~/components/EnhancedTable/TablePagination';
import { RowWithSubrows } from '~/components/Table';
import useSwapListOrdersFormatting from '~/hooks/swap/list-orders/useSwapListOrdersFormatting';
import useSwapListOrdersSorted, {
  UseSwapListOrdersSortedConfig,
  UseSwapListOrdersSortedParams,
} from '~/hooks/swap/list-orders/useSwapListOrdersSorted';
import { useWallet } from '~/hooks/wallet/wallet';
import {
  SmartVaultOperation,
  SmartVaultOperationListResult,
  SwapOrderStatus,
  useGetSmartVaultQuery,
  useListSmartVaultOperationsQuery,
} from '~/redux/api';
import { IntervalType } from '~/utils/interval';

import EmptyTableScreen from '../Explore/components/EmptyTableScreen';
import TableOrderFilteringControls from '../Explore/components/TableOrderFilteringControls';
import { tableHeadlines } from '../Explore/mocks';
import { PillSelect } from '../Leaderboard/components/PillSelect';
import CellWrapper from '../SmartVaults/components/CellWrapper/CellWrapper';
import { DEFAULT_POLLING_INTERVAL } from '../Swap/SwapPageContent';
import { orderFilterOptions } from '../TradingWallet/constants';
import { ChartMode } from '../TradingWallet/types/ChartMode';
import { OrderFilter } from '../TradingWallet/types/OrderFilter';
import Card from './components/Card';
import OperationsTable from './components/OperationsTable';
import Stats from './components/Stats';
import { smartVaultDetailsChartData } from './mocks';

export const convertOperationsToTableRows = (
  operationsData: SmartVaultOperationListResult | undefined,
): RowWithSubrows[] => {
  if (!operationsData) {
    return [];
  }

  return operationsData.results.map((operation: SmartVaultOperation) => ({
    id: operation.transactionHash,
    cells: [
      // First three cells are for assets
      ...operation.assets.slice(0, 3).map((asset) => ({
        content: `${asset.assetAmount} ${asset.asset?.shortName}`,
        decorator: (content: string) => (
          <CellWrapper data={content} avatar={asset.asset?.iconUrl} />
        ),
        align: 'left' as const,
      })),
      // Fill empty asset cells if less than 3 assets
      ...Array(3 - operation.assets.length).fill({
        content: '',
        align: 'left' as const,
      }),
      {
        content: operation.operationType,
        align: 'left' as const,
      },
      {
        content: operation.status,
        align: 'left' as const,
      },
      {
        content: '0.5 ADA',
        align: 'left' as const,
      },
      {
        content: operation.transactionDate
          ? new Date(operation.transactionDate).toLocaleString()
          : '',
        align: 'left' as const,
      },
    ],
    subrows: [],
  }));
};

const PageContent = () => {
  const params = useParams();
  const navigate = useNavigate();

  const smartVaultId = params.smartVaultId as string;

  const [expandedRowId, setExpandedRowId] = useState<number | string | null>(null);
  const [orderStatus, setOrderStatus] = useState<SwapOrderStatus | null>(null);
  const [operationFilter, setOperationFilter] = useState(OrderFilter.All);
  const [chartMode, setChartMode] = useState(ChartMode.Earned);
  const [intervalType, setIntervalType] = useState(IntervalType.ThreeMonth);

  const { isWalletConnected } = useWallet();
  const { data: operationsData, isLoading: isOperationsLoading } =
    useListSmartVaultOperationsQuery({ smartVaultId }, { skip: !isWalletConnected });

  const { data: smartVault } = useGetSmartVaultQuery(
    {
      smartVaultId,
    },
    {
      skip: !isWalletConnected,
    },
  );

  const orderFilterCriteria: UseSwapListOrdersSortedParams = {
    count: 20,
    filterByWalletStakeKeyHash: '',
    filterByOrderSwapStatus: orderStatus || undefined,
  };

  const hookConfigOptions: UseSwapListOrdersSortedConfig = {
    skip: !isWalletConnected,
    pollingInterval: DEFAULT_POLLING_INTERVAL,
  };

  const {
    data: {
      data: ordersData,
      isLoading: isLoadingOrders,
      isFetching: isFetchingOrders,
      isLoadingWithArgsUpdated,
    },
    pagination,
    sortState,
    handleSortChange,
    resetPagination,
  } = useSwapListOrdersSorted(orderFilterCriteria, hookConfigOptions);

  const ordersRows = useSwapListOrdersFormatting({
    orders: ordersData?.results || [],
    ordersTableExpandedRowId: expandedRowId,
    isMyOrders: true,
  });

  const handleBack = useCallback(() => {
    navigate('/smart-vaults');
    window.scrollTo(0, 0);
  }, []);

  const handleOrderStatusChange = (newStatus: SwapOrderStatus | null) => {
    setOrderStatus(newStatus);
    resetPagination();
  };

  return (
    <PageContent.Wrapper>
      <Stack direction="row">
        <Button
          size="small"
          color="transparent"
          startIcon={<ChevronLeft />}
          onClick={handleBack}
        >
          Back
        </Button>
      </Stack>

      <Stack spacing={2}>
        <Card smartVaultId={smartVaultId} smartVault={smartVault} />
      </Stack>

      <Stats
        chartData={smartVaultDetailsChartData}
        chartMode={chartMode}
        intervalType={intervalType}
        isLoading={false}
        onChartModeChange={setChartMode}
        onIntervalTypeChange={setIntervalType}
      />

      <Stack spacing={2}>
        {isWalletConnected ? (
          <Grid container direction="column">
            <TableOrderFilteringControls
              orderStatus={orderStatus}
              handleOrderStatusChange={handleOrderStatusChange}
            />

            <EnhancedTableContainer
              orders={ordersRows}
              headlines={tableHeadlines}
              isInitialLoading={isLoadingOrders}
              isLoading={isLoadingWithArgsUpdated}
              sortState={sortState}
              handleSortChange={handleSortChange}
              expandedRowId={expandedRowId}
              setExpandedRowId={setExpandedRowId}
            />

            <TablePagination isLoading={isFetchingOrders} {...pagination} />
          </Grid>
        ) : (
          <EmptyTableScreen
            title="No open orders yet"
            description="There are not any open orders created yet"
            buttonText="Create Order"
          />
        )}

        <PageContent.OrderControls>
          <Typography variant="h6">Operations</Typography>

          <PillSelect
            value={operationFilter}
            options={orderFilterOptions}
            onChange={setOperationFilter}
          />
        </PageContent.OrderControls>

        <OperationsTable
          operations={convertOperationsToTableRows(operationsData)}
          isLoading={isOperationsLoading}
          isInitialLoading={false}
        />
      </Stack>
    </PageContent.Wrapper>
  );
};

PageContent.OrderControls = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    justify-content: space-between;
  }
`;

PageContent.Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;

export default PageContent;
