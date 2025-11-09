import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { map } from 'lodash';
import { FC, useEffect, useRef, useState } from 'react';
import useResizeObserver from '~/hooks/misc/useResizeObserver';
import { useWallet } from '~/hooks/wallet/wallet';
import { OrderBookEntry } from '~/redux/api';

import { OrderBookAssets } from './OrderBookCard';
import OrderBookOrdersTableRow, { TradingListType } from './OrderBookOrdersTableRow';

export type OrderBookOrdersTableProps = {
  orders: OrderBookEntry[];
  orderBookAssets: OrderBookAssets;
  tableHeadLabels?: string[];
  tradingListType: TradingListType;
};

const OrderBookOrdersTable: FC<OrderBookOrdersTableProps> = ({
  orders,
  orderBookAssets,
  tradingListType,
}) => {
  const { isWalletConnected } = useWallet();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useResizeObserver({
    containerRef: tableContainerRef,
    onResize: (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLElement) {
          const parentHeight = entry.target.offsetHeight;
          setParentHeight(parentHeight);
        }
      }
    },
  });

  const handleRowExpand = (orderId: string) => {
    if (!isWalletConnected) return;
    if (expandedRow === orderId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(orderId);
    }
  };

  const isUpperTable = tradingListType === TradingListType.upper;

  const marketPriceLabelHeight = 110;
  const tableSpacings = 25;

  const upperTableHeight = 281;
  const lowerTableHeight =
    parentHeight > 0
      ? parentHeight - tableSpacings - upperTableHeight - marketPriceLabelHeight
      : 0;

  const tableHeight = isUpperTable ? upperTableHeight : lowerTableHeight;

  useEffect(() => {
    if (isUpperTable && tableRef.current) {
      // Scroll to the bottom of the table
      const scrollHeight = tableRef.current.scrollHeight;
      const height = tableRef.current.clientHeight;
      tableRef.current.scrollTop = scrollHeight - height;
    }
  }, []);

  return (
    <TableContainerWrapper container ref={tableContainerRef}>
      <TableContainerStyled ref={tableRef} height={tableHeight}>
        <NoBorderTable size="small" aria-label="order table" stickyHeader>
          <TableHeadStyled>
            <TableRow>
              <TableCellStyled align="left">
                Amount ({orderBookAssets.amountAsset?.shortName})
              </TableCellStyled>
              <TableCellStyled align="left">
                Price ({orderBookAssets.priceAsset?.shortName})
              </TableCellStyled>
              <TableCellStyled align="left" />
            </TableRow>
          </TableHeadStyled>

          <TableBody>
            {map(orders, ({ order }) => (
              <OrderBookOrdersTableRow
                order={order}
                key={order.orderId}
                tradingListType={tradingListType}
                isExpanded={expandedRow === order.orderId}
                onRowClick={() => handleRowExpand(order.orderId)}
              />
            ))}
          </TableBody>
        </NoBorderTable>
      </TableContainerStyled>
    </TableContainerWrapper>
  );
};

const TableContainerWrapper = styled(Grid)({
  position: 'relative',
});

const TableContainerStyled = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== 'height',
})<{
  height: number;
}>(({ theme, height }) => ({
  overflow: 'auto',

  minHeight: height + 'px',
  maxHeight: height + 'px',

  [theme.breakpoints.down('sm')]: {
    minHeight: '210px',
    maxHeight: '210px',
    overflowY: 'auto',
  },
}));

const TableHeadStyled = styled(TableHead)({
  '& th': {
    background: 'transparent',
    backgroundColor: '#171D2D',
    paddingBottom: '5px',
  },
});

const NoBorderTable = styled(Table)({
  backgroundColor: 'transparent',
  boxShadow: 'none',

  '& thead th': {
    borderBottom: 'none',
  },

  '& tbody td': {
    borderBottom: 'none',
  },
  '& tbody tr:last-child td': {
    borderBottom: 'none',
  },
});

const TableCellStyled = styled(TableCell)(({ theme }) => ({
  textAlign: 'left',
  color: theme.palette.grey[100],
  fontSize: '12px',
  fontWeight: '600',
  lineHeight: '16px',
  paddingBottom: '10px',
  padding: '0',
  paddingLeft: '4px',

  [theme.breakpoints.down('sm')]: {
    verticalAlign: 'top',
  },
}));

export default OrderBookOrdersTable;
