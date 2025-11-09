import { ChartOptions, ColorType, CrosshairMode, DeepPartial } from 'lightweight-charts';

export const getChartOptions = (): DeepPartial<ChartOptions> => ({
  autoSize: true,
  grid: {
    horzLines: {
      visible: false,
    },
    vertLines: {
      visible: false,
    },
  },
  rightPriceScale: {
    visible: false,
  },
  timeScale: {
    visible: false,
  },
  crosshair: {
    mode: CrosshairMode.Hidden,
  },
  handleScroll: false,
  handleScale: false,
  layout: {
    background: { type: ColorType.Solid, color: '#202740' },
    textColor: '#ffffff',
  },
});
