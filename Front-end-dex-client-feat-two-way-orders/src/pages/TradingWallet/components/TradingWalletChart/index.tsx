import { Grid, styled, useTheme } from '@mui/material';
import {
  AreaData,
  createChart,
  IChartApi,
  ISeriesApi,
  Time,
  UTCTimestamp,
} from 'lightweight-charts';
import { last } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChartTooltip, DataPointTooltip } from '~/components/ChartTooltip';
import { IChartItem, IChartItemExtraData } from '~/pages/Leaderboard/types/IChartItem';
import {
  createCrosshairMoveHandler,
  getDefaultChartOptions,
} from '~/pages/Swap/components/MarketData/chartUtils';
import { Asset } from '~/redux/api';

import { getTooltipLabelByMode } from '../../helpers/getChartItemsByMode';
import { ChartMode } from '../../types/ChartMode';
import { getDefaultAreaSeriesOptions } from './helpers/getDefaultAreaSeriesOptions';
import { renderDataValueByMode } from './helpers/renderDataValueByMode';

export interface IPoint {
  x: number;
  y: number;
}

export interface TradingWalletChartProps {
  priceAsset: Asset | null;
  dataPoints: IChartItem[];
  chartMode: ChartMode;
  setCursorChartData: (data: IChartItemExtraData | null) => void;
}

export const TradingWalletChart = ({
  priceAsset,
  dataPoints,
  chartMode,
  setCursorChartData,
}: TradingWalletChartProps) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [chart, setChart] = useState<IChartApi | null>(null);
  const [valueAreaSeries, setValueAreaSeries] = useState<ISeriesApi<'Area'> | null>(null);

  const [tooltipContent, setTooltipContent] = useState<DataPointTooltip>({
    date: null,
    fields: null,
    isVisible: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const lastDataPointWithData = last(dataPoints.filter((point) => point.value));

    if (tooltipContent.isVisible === false) {
      setCursorChartData(lastDataPointWithData || null);
    }
  }, [tooltipContent]);

  const getSeriesDataTooltipFields = useCallback(
    <SeriesData extends { time: Time; value: number }>(
      seriesData?: SeriesData,
    ): Record<string, string> => {
      const cursorTime = seriesData?.time;
      const dataPoint = dataPoints.find((point) => point.time === cursorTime);
      const price = dataPoint?.price;

      const {
        assetOneAmountBought,
        assetTwoAmountBought,
        assetOneAmountNetPosition,
        assetTwoAmountNetPosition,
        assetOneBoughtCount,
        assetTwoBoughtCount,
        openTransactionFeeAmount,
        cancelTransactionFeeAmount,
        buyMakerFromAssetFeeAmount,
        sellMakerFromAssetFeeAmount,
        makerAdaFlatFeeAmount,
      } = dataPoint || {};

      setCursorChartData({
        assetOneAmountBought,
        assetTwoAmountBought,
        assetOneAmountNetPosition,
        assetTwoAmountNetPosition,
        assetOneBoughtCount,
        assetTwoBoughtCount,
        openTransactionFeeAmount,
        cancelTransactionFeeAmount,
        buyMakerFromAssetFeeAmount,
        sellMakerFromAssetFeeAmount,
        makerAdaFlatFeeAmount,
      });

      const timeSeriesValue = seriesData?.value;

      const formattedModeSpecificValue =
        priceAsset && typeof timeSeriesValue === 'number'
          ? renderDataValueByMode(timeSeriesValue, chartMode, priceAsset)
          : '-';

      const tooltipLabel = getTooltipLabelByMode(chartMode);

      return {
        [tooltipLabel]: formattedModeSpecificValue,
        ['Price']: price ? `${price} ${priceAsset?.shortName}` : '-',
      };
    },
    [dataPoints, chartMode, priceAsset],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, getDefaultChartOptions(theme));
    const valueAreaSeries = chart.addAreaSeries(getDefaultAreaSeriesOptions(theme));

    const observer = new ResizeObserver(() => chart.timeScale().fitContent());

    observer.observe(containerRef.current);

    setChart(chart);
    setValueAreaSeries(valueAreaSeries);

    chart.subscribeCrosshairMove(
      createCrosshairMoveHandler(
        setTooltipContent,
        valueAreaSeries,
        getSeriesDataTooltipFields,
      ),
    );

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [dataPoints, chartMode, priceAsset]);

  useEffect(() => {
    if (!chart || !valueAreaSeries) return;

    const valueAreaData: AreaData[] = dataPoints
      .filter((dataPoint): dataPoint is Required<IChartItem> => !!dataPoint.value)
      .map((dataPoint) => ({
        time: dataPoint.time as UTCTimestamp,
        value: dataPoint.value,
      }));

    valueAreaSeries.setData(valueAreaData);

    chart.timeScale().fitContent();
  }, [chart, valueAreaSeries, dataPoints]);

  return (
    <Grid display="flex" flexDirection="column">
      <TradingWalletChart.Wrapper>
        <TradingWalletChart.Container ref={containerRef} />
        <ChartTooltip tooltipContent={tooltipContent} />
      </TradingWalletChart.Wrapper>
    </Grid>
  );
};

TradingWalletChart.Wrapper = styled('div')`
  width: 100%;
  height: 100%;
  position: relative;
`;

TradingWalletChart.Container = styled('div')`
  width: 100%;
  height: 30rem;
`;
