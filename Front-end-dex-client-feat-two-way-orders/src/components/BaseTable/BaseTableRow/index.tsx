import { TableRow as MuiTableRow, styled } from '@mui/material';

export const BaseTableRow = styled(MuiTableRow)`
  &:not(:last-child) td,
  &:not(:last-child) th {
    border-color: #2d3654;
  }

  &:last-child td,
  &:last-child th {
    border: 0;
  }

  & td:first-child,
  & th:first-child {
    padding-left: ${({ theme }) => theme.spacing(3)};
  }

  & td:last-child,
  & th:last-child {
    padding-right: ${({ theme }) => theme.spacing(3)};
  }
`;
