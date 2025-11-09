import { Grid, Stack, Typography, TypographyProps } from '@mui/material';
import { ReactNode } from 'react';

import { InfoIcon } from '../Icons';
import Tooltip from '../Tooltip';

export interface StatTypographyProps extends TypographyProps {
  label: string;
  tooltip?: ReactNode;
  children?: ReactNode;
}

export const StatTypography = ({
  label,
  children,
  tooltip,
  ...props
}: StatTypographyProps) => (
  <Stack>
    {!tooltip ? (
      <Typography variant="caption" color="#c1cef1">
        {label}
      </Typography>
    ) : (
      <Grid container gap="10px">
        <Typography variant="caption" color="#c1cef1">
          {label}
        </Typography>
        <Tooltip title={tooltip}>
          <Grid lineHeight="100%" alignContent="center">
            <InfoIcon />
          </Grid>
        </Tooltip>
      </Grid>
    )}
    <Typography {...props}>{children}</Typography>
  </Stack>
);
