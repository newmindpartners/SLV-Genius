import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  styled,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/components/AppLayout/config';
import EnhancedTable from '~/components/EnhancedTable';
import type { Headline, RowWithSubrows } from '~/components/Table';
import { useTradingPairs } from '~/context/tradingPairsContext';
import type { TwoWayOrderList } from '~/redux/api/core';
import { indivisibleToUnit } from '~/utils/mathUtils';
import { formatNumber } from '~/utils/mathUtils';
import { defaultAdaPrecision } from '~/utils/tradingPairsUtils';

interface OrdersTableProps {
  orders: TwoWayOrderList;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const OrdersTable: FC<OrdersTableProps> = ({ orders, isLoading, error, onRefresh }) => {
  console.log('OrdersTable orders:', orders, 'isLoading:', isLoading, 'error:', error);
  const navigate = useNavigate();
  const { tradingAssets } = useTradingPairs();

  const getPrecision = (assetId?: string | null): number => {
    if (!assetId) return defaultAdaPrecision;
    const asset = tradingAssets.find((a) => a.assetId === assetId);
    return asset?.decimalPrecision ?? defaultAdaPrecision;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'PLACED':
        return 'primary';
      case 'FILLED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <TableWrapper>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </TableWrapper>
    );
  }

  if (error) {
    return (
      <TableWrapper>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </TableWrapper>
    );
  }

  const headlines: Headline[] = [
    { content: 'ID', align: 'left' },
    { content: 'Offer', align: 'right' },
    { content: 'Price', align: 'right' },
    { content: 'Status', align: 'center' },
    { content: 'End Date', align: 'center' },
    { content: 'Created', align: 'center' },
  ];

  const rows: RowWithSubrows[] = orders.map((order) => {
    const fromPrecision = getPrecision(order.fromAssetId);
    const toPrecision = getPrecision(order.toAssetId);
    const fromUnit = indivisibleToUnit(order.fromAssetAmount, fromPrecision);
    const toUnit = indivisibleToUnit(order.toAssetAmount, toPrecision);
    return {
      id: order.twoWayOrderId,
      cells: [
        { content: `#${order.twoWayOrderId.slice(-6)}`, align: 'left' },
        { content: `${fromUnit} → ${toUnit}`, align: 'right' },
        { content: formatNumber(String(order.price)), align: 'right' },
        {
          content: (order.orderStatus as string) || 'UNKNOWN',
          align: 'center',
          decorator: (status) => (
            <Chip
              label={status}
              color={getStatusColor(status.toUpperCase())}
              size="small"
            />
          ),
        },
        {
          content: order.effectiveUntilDate ? formatDate(order.effectiveUntilDate) : '-',
          align: 'center',
        },
        { content: order.created ? formatDate(order.created) : '-', align: 'center' },
      ],
      subrows: [],
    };
  });

  return (
    <TableWrapper>
      <TableHeader>
        <Typography variant="h5" component="h1" gutterBottom>
          Two-Way Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {orders.length} order{orders.length !== 1 ? 's' : ''} found
        </Typography>
      </TableHeader>
      <EnhancedTable
        orders={rows}
        headlines={headlines}
        isInitialLoading={false}
        isLoading={isLoading}
        onRowClick={(rowId) => navigate(`${ROUTES.SLV}/order/${rowId}`)}
      />
    </TableWrapper>
  );
};

const TableWrapper = styled(Box)({
  width: '100%',
});

const TableHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export default OrdersTable;
