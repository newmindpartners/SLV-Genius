import { alpha } from '@mui/material';
import { AreaSeriesOptions, DeepPartial, LineType } from 'lightweight-charts';

export const getAreaSeriesOptions = (color: string): DeepPartial<AreaSeriesOptions> => ({
  lineType: LineType.Curved,
  priceLineVisible: false,
  lineColor: color,
  topColor: alpha(color, 0.5),
  bottomColor: alpha(color, 0),
});
