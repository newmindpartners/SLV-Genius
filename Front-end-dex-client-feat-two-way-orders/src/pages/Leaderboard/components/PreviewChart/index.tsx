import { styled } from '@mui/material';
import {
  BaselineData,
  createChart,
  IChartApi,
  ISeriesApi,
  Time,
} from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

import { IChartItem } from '../../types/IChartItem';
import { getAreaSeriesOptions } from './helpers/getAreaSeriesOptions';
import { getChartOptions } from './helpers/getChartOptions';

export interface PreviewChartProps {
  color: string;
  data: IChartItem[];
}

export const PreviewChart = ({ color, data }: PreviewChartProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [chart, setChart] = useState<IChartApi | null>(null);
  const [areaSeries, setAreaSeries] = useState<ISeriesApi<'Area'> | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const chart = createChart(ref.current, getChartOptions());
    const areaSeries = chart.addAreaSeries(getAreaSeriesOptions(color));
    const observer = new ResizeObserver(() => chart.timeScale().fitContent());

    observer.observe(ref.current);

    setChart(chart);
    setAreaSeries(areaSeries);

    return () => chart.remove();
  }, []);

  useEffect(() => {
    if (!areaSeries || !chart) return;
    areaSeries.setData(data as BaselineData<Time>[]);
    chart.timeScale().fitContent();
  }, [chart, areaSeries, data]);

  return <PreviewChart.Wrapper ref={ref} />;
};

PreviewChart.Wrapper = styled('div')`
  width: 100%;
  height: 100%;
`;
