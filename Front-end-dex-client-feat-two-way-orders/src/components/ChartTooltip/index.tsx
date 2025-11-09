import { Grid, Paper, styled, Typography } from '@mui/material';
import { mapValues } from 'lodash';

export type DataPointTooltip = {
  fields: Record<string, string | null> | null;
  date: string | null;
  isVisible: boolean;
  x: number;
  y: number;
};

export type ChartTooltipProps = {
  tooltipContent: DataPointTooltip;
};

export const ChartTooltip = ({
  tooltipContent: { fields, date, isVisible, x, y },
}: ChartTooltipProps) => {
  const tooltipElements: Record<string, React.ReactNode> = mapValues(
    fields,
    (value, key) => (
      <Grid display="flex" gap="3px" alignItems="baseline">
        <Typography variant="poweredBy" fontWeight="600" color="buttonsInactive">
          {key}:
        </Typography>
        {value && (
          <Typography variant="statusCard" fontWeight="700" color="textColor">
            {value}
          </Typography>
        )}
      </Grid>
    ),
  );

  return (
    <PaperWrapper isVisible={isVisible} x={x} y={y}>
      <Grid display="flex" flexDirection="column" whiteSpace="nowrap">
        {date && (
          <Typography variant="poweredBy" fontWeight="600" color="buttonsInactive">
            Date: {date.toString()}
          </Typography>
        )}
        {Object.values(tooltipElements)}
      </Grid>
    </PaperWrapper>
  );
};

const PaperWrapper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isVisible' && prop !== 'x' && prop !== 'y',
})<{ isVisible: boolean; x: number; y: number }>(({ theme, isVisible, x, y }) => ({
  display: isVisible ? 'block' : 'none',
  position: 'absolute',
  left: `${x}px`,
  top: `${y}px`,
  transform: 'translate(-50%, -100%)',
  backgroundColor: theme.palette.lines.dark,
  color: theme.palette.textColor.dark,
  padding: '10px 15px',
  borderRadius: theme.borderRadius.xs,
  zIndex: 2, // the tooltip should be displayed over the vertical line
}));
