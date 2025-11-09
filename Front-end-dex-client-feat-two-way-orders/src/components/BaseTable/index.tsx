import {
  CardProps,
  Table as MuiTable,
  TableContainer as MuiTableContainer,
} from '@mui/material';
import { ReactNode } from 'react';

import { Card } from '../Card';

export interface BaseTableProps extends CardProps {
  children?: ReactNode;
}

export const BaseTable = ({ children, ...props }: BaseTableProps) => (
  <MuiTableContainer component={Card} {...props}>
    <MuiTable>{children}</MuiTable>
  </MuiTableContainer>
);
