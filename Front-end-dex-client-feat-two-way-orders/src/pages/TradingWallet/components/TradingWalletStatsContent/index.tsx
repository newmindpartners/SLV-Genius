import { styled } from '@mui/material';
import { IChartItemExtraData } from '~/pages/Leaderboard/types/IChartItem';
import MarketChartSkeleton from '~/pages/Swap/components/MarketChartSkeleton';
import NoChartResults from '~/pages/Swap/components/MarketData/NoChartResults';
import { filterTradingWalletWhiteSpace } from '~/utils/charts';

import { IChartData } from '../../helpers/getChartItemsByMode';
import { ChartMode } from '../../types/ChartMode';
import { TradingWalletChart } from '../TradingWalletChart';

interface Props {
  chartData: IChartData;
  chartMode: ChartMode;
  isLoading: boolean;
  setCursorChartData: (data: IChartItemExtraData | null) => void;
}

export const MIN_DATA_SIZE_TO_DISPLAY_TRADING_WALLET_CHART = 3;

const TradingWalletStatsContent = ({
  chartData,
  chartMode,
  isLoading,
  setCursorChartData,
}: Props) => {
  const filteredTimeSeriesDataPoints = filterTradingWalletWhiteSpace(
    chartData.dataPoints,
  );
  const isDataSufficientForChart =
    filteredTimeSeriesDataPoints.length >= MIN_DATA_SIZE_TO_DISPLAY_TRADING_WALLET_CHART;

  return (
    <TradingWalletStatsContent.BotChart>
      {isLoading ? (
        <MarketChartSkeleton />
      ) : isDataSufficientForChart ? (
        <TradingWalletChart
          {...chartData}
          chartMode={chartMode}
          setCursorChartData={setCursorChartData}
        />
      ) : (
        <NoChartResults
          title="Not enough trades"
          description="More orders need to have been opened by this trading bot in order to display a meaningful chart"
        />
      )}
    </TradingWalletStatsContent.BotChart>
  );
};

TradingWalletStatsContent.BotChart = styled('div')`
  width: 100%;
  height: 100%;
`;

export default TradingWalletStatsContent;
