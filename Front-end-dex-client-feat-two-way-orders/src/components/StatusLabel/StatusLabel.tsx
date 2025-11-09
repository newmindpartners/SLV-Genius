import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled, Theme } from '@mui/material/styles';
import { FC } from 'react';

type StatusType = 'success' | 'warning' | 'default';
type VariantType = 'text' | 'outlined';

export interface Props {
  status: StatusType;
  variant: VariantType;
}

const StatusLabel: FC<Props> = ({ status, variant = 'text' }) => {
  const StatusTitleWrapper = styled('div')<{ status: StatusType }>(
    ({ status, theme }) => ({
      display: 'inline-block',
      alignItems: 'center',
      color: getStatusColor(status, theme).color,
      borderRadius: theme.borderRadius.xs,
      textTransform: 'capitalize',
      fontFamily: theme.typography.fontFamily,
      ...getCustomVariant(theme, status)[variant],
    }),
  );

  return (
    <StatusTitleWrapper status={status}>
      <Grid container alignItems="center">
        <StatusDot status={status} />
        <Typography variant="statusCard">{status}</Typography>
      </Grid>
    </StatusTitleWrapper>
  );
};

const StatusDot = styled('div')<{ status: StatusType }>(({ status, theme }) => ({
  width: '5px',
  height: '5px',
  margin: '0 9px 1px 0',
  borderRadius: theme.borderRadius.md,
  backgroundColor: getStatusColor(status, theme).color,
  boxShadow: `0px 0px 0px 5px ${getStatusColor(status, theme).bg}`,
}));

const getCustomVariant = (theme: Theme, status: StatusType) => ({
  text: {},
  outlined: {
    padding: '8px 13px',
    paddingLeft: '17px',
    borderRadius: '50px',
    background: getStatusColor(status, theme).fullBg,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStatusColor = (status: StatusType, theme: any) => {
  const { successColorStatus, upcomingColorStatus, soldOutColorStatus } = theme.palette;
  switch (status) {
    case 'success':
      return {
        color: successColorStatus.main,
        bg: successColorStatus.transparentBg,
        fullBg: successColorStatus.transparentFullBg,
      };
    case 'warning':
      return {
        color: upcomingColorStatus.main,
        bg: upcomingColorStatus.transparentBg,
        fullBg: upcomingColorStatus.transparentFullBg,
      };
    case 'default':
      return {
        color: soldOutColorStatus.main,
        bg: soldOutColorStatus.transparentBg,
        fullBg: soldOutColorStatus.transparentFullBg,
      };
    default:
      return successColorStatus.main;
  }
};

export default StatusLabel;
