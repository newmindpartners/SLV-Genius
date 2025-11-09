import { CircularProgress, CircularProgressProps } from '@mui/material';
import { ReactElement } from 'react';

export const CircularLoader = ({
  isLoading,
  children,
  circularProgressProps,
}: {
  isLoading: boolean;
  children: ReactElement;
  circularProgressProps: CircularProgressProps;
}): ReactElement =>
  isLoading ? <CircularProgress {...circularProgressProps} /> : children;
