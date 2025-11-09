import {
  Tooltip as MUITooltip,
  TooltipProps as MUITooltipProps,
  styled,
  tooltipClasses,
} from '@mui/material';
import { FC, ReactElement } from 'react';

export interface TooltipProps extends MUITooltipProps {}

const Tooltip: FC<TooltipProps> = ({ ...props }): ReactElement => {
  return <StyledTooltip {...props} />;
};

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <MUITooltip classes={{ popper: className }} {...props}>
    {props.children}
  </MUITooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backdropFilter: 'blur(10px)',
    background: 'rgba(50, 63, 98, 0.5)',
    padding: '14px 19px',
    borderRadius: '13px',
    textAlign: 'center',
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightLight,
    fontFamily: theme.typography.fontFamily,
    maxWidth: '330px',
    whiteSpace: 'pre-line',
  },
}));

export default Tooltip;
