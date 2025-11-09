import { alpha, Theme } from '@mui/material';
import { AreaSeriesOptions, DeepPartial, LineType } from 'lightweight-charts';

export const getDefaultAreaSeriesOptions = (
  theme: Theme,
): DeepPartial<AreaSeriesOptions> => ({
  lineColor: theme.palette.chip.info.color,
  topColor: alpha(theme.palette.chip.info.color, 0.5),
  bottomColor: alpha(theme.palette.chip.info.color, 0),
  lineType: LineType.Curved,
});
