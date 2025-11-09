import {
  Box,
  Table as MuiTable,
  TableContainer as MuiTableContainer,
  styled,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { map } from 'lodash';
import { FC, Fragment } from 'react';
import {
  isKeyOfSortOptionMap,
  SortKeys,
  sortOptionMap,
  SortState,
} from '~/hooks/swap/list-orders/useSwapListOrdersSorted';

import NoResultsTable from './NoResultsTable';
import SortingArrows from './SortingArrows';

type Align = TableCellProps['align'];

export type Headline = {
  content: string;
  align: Align;
  sortKey?: SortKeys;
};

export type Cell = {
  content: string;
  decorator?: (content: string) => JSX.Element | string;
  align: Align;
};

export type Row = {
  id: number | string;
  cells: Cell[];
};

export type RowWithSubrows = Row & {
  subrows: Row[];
};

export type TableProps = {
  headlines: Headline[];
  rows: RowWithSubrows[];

  expandedRowId?: number | string | null;
  setExpandedRowId?: (id: number | string | null) => void;
  sortState?: SortState;
  handleSortChange?: (content: string) => void;
  onRowClick?: (rowId: number | string) => void;
};

const Table: FC<TableProps> = ({
  headlines,
  rows,
  expandedRowId,
  setExpandedRowId,
  sortState,
  handleSortChange,
  onRowClick,
}) => {
  const handleRowClick = (rowId: number | string | null) =>
    expandedRowId === rowId
      ? setExpandedRowId && setExpandedRowId(null)
      : setExpandedRowId && setExpandedRowId(rowId);

  return (
    <MuiTableContainer>
      <MuiTable>
        <TableHeadComponent
          headlines={headlines}
          sortState={sortState}
          handleSortChange={handleSortChange}
        />

        {rows.length > 0 && (
          <TableBodyComponent
            rows={rows}
            headlines={headlines}
            handleRowClick={handleRowClick}
            expandedRowId={expandedRowId || null}
            onRowClick={onRowClick}
          />
        )}
      </MuiTable>
      {rows.length === 0 && (
        <NoResultsTable title="No orders" description="We couldn't find any orders" />
      )}
    </MuiTableContainer>
  );
};

type TableHeadComponentProps = {
  headlines: Headline[];

  sortState?: SortState;
  handleSortChange?: (content: string) => void;
};

const TableHeadComponent: FC<TableHeadComponentProps> = ({
  headlines,
  sortState,
  handleSortChange,
}) => (
  <TableHead>
    <TableRow>
      {map(headlines, (headline) => {
        const sortKey = headline.sortKey;
        const isSelectedColumn = headline.sortKey === sortState?.column;

        return (
          <TableCell
            align={headline.align}
            key={`${headline.content}-heading`}
            onClick={() => handleSortChange && sortKey && handleSortChange(sortKey)}
          >
            <SortLabel
              IconComponent={() =>
                sortState && (
                  <SortingArrows
                    isSelected={isSelectedColumn}
                    direction={sortState.direction}
                  />
                )
              }
              hideSortIcon={
                sortKey && isKeyOfSortOptionMap(sortKey) && sortOptionMap[sortKey]
                  ? false
                  : true
              }
            >
              <Box component="span">{headline.content}</Box>
            </SortLabel>
          </TableCell>
        );
      })}
    </TableRow>
  </TableHead>
);

type TableBodyComponentProps = {
  rows: RowWithSubrows[];
  headlines: Headline[];

  expandedRowId: number | string | null;
  handleRowClick: (id: number | string | null) => void;
  onRowClick?: (rowId: number | string) => void;
};

const TableBodyComponent: FC<TableBodyComponentProps> = ({
  rows,
  headlines,
  handleRowClick,
  expandedRowId,
  onRowClick,
}) => {
  const isRowExpandedAndHasSubrows = (rowId: number | string, subrows: Row[]): boolean =>
    expandedRowId === rowId && subrows.length > 0;

  return (
    <TableBody>
      {map(rows, (row) => (
        <Fragment key={row.id}>
          <TableRow
            onClick={() => {
              if (onRowClick) onRowClick(row.id);
              handleRowClick(row.id);
            }}
            className={
              isRowExpandedAndHasSubrows(row.id, row.subrows) ? 'expanded-row' : ''
            }
          >
            {map(row.cells, (cell, index) => (
              <TableCell key={index} align={cell.align}>
                {cell?.decorator?.(cell.content) || cell.content}
              </TableCell>
            ))}
          </TableRow>

          {isRowExpandedAndHasSubrows(row.id, row.subrows) && (
            <Subrow headlines={headlines} row={row} />
          )}
        </Fragment>
      ))}
    </TableBody>
  );
};

type SubrowProps = {
  headlines: Headline[];
  row: RowWithSubrows;
};

const Subrow: FC<SubrowProps> = ({ headlines, row }) => (
  <TableRow className="nested-table-first-row">
    <TableCell colSpan={headlines.length}>
      <SubrowsTable headlines={headlines} row={row} />
    </TableCell>
  </TableRow>
);

type SubrowsTableProps = {
  headlines: Headline[];
  row: RowWithSubrows;
};

const SubrowsTable: FC<SubrowsTableProps> = ({ headlines, row }) => (
  <SubrowsTableWrapper>
    <MuiTable>
      <TableHeadComponent headlines={headlines} />
      <TableBody>
        {map(row.subrows, (subrowCell, subrowIndex) => (
          <TableRow key={subrowIndex}>
            {map(subrowCell.cells, (cell, index) => (
              <TableCell key={index} align={cell.align}>
                {cell?.decorator?.(cell.content) || cell.content}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </MuiTable>
  </SubrowsTableWrapper>
);

const SortLabel = styled(TableSortLabel)({
  '&:hover': {
    color: 'inherit',
  },

  '&:active': {
    color: 'white',
  },
});

const SubrowsTableWrapper = styled(MuiTableContainer)(({ theme }) => ({
  borderRadius: '15px',
  overflow: 'hidden',
  marginBottom: '10px',

  '& > .MuiTable-root': {
    '& > .MuiTableHead-root': {
      padding: '0 20px !important',

      '& > .MuiTableRow-root': {
        '& > .MuiTableCell-root': {
          width: 'calc(100% / 7)',
          backgroundColor: '#172239',
          color: theme.palette.buttonsInactive.dark,
          padding: '10px 15px 0px',
          height: '25px',
          fontSize: '12px',
          fontWeight: '600',
          border: 'none',
        },
      },
    },

    '& > .MuiTableBody-root': {
      '& > .MuiTableRow-root': {
        '& > .MuiTableCell-root': {
          width: 'calc(100% / 7)',
          backgroundColor: '#172239',
          height: '62px',
          border: 'none',

          '&:hover': {
            '& > .MuiTableCell-root:last-of-type': {
              '& button': {
                opacity: '1',
              },
            },
          },
        },
      },
    },
  },
}));

export default Table;
