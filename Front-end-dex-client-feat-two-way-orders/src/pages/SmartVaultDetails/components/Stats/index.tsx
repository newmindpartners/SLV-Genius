import { Stack, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { Card } from '~/components/Card';
import { PillSelect } from '~/pages/Leaderboard/components/PillSelect';
import { IChartItemExtraData } from '~/pages/Leaderboard/types/IChartItem';
import TradingWalletStatsContent from '~/pages/TradingWallet/components/TradingWalletStatsContent';
import { chartIntervalOptions, chartModeOptions } from '~/pages/TradingWallet/constants';
import { IChartData } from '~/pages/TradingWallet/helpers/getChartItemsByMode';
import { ChartMode } from '~/pages/TradingWallet/types/ChartMode';
import { IntervalType } from '~/utils/interval';

export interface SmartVaultStatsProps {
  chartData: IChartData;
  chartMode: ChartMode;
  intervalType: IntervalType;
  isLoading: boolean;
  onChartModeChange: (mode: ChartMode) => void;
  onIntervalTypeChange: (interval: IntervalType) => void;
}

const Stats = ({
  chartData,
  chartMode,
  intervalType,
  isLoading,
  onChartModeChange,
  onIntervalTypeChange,
}: SmartVaultStatsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [, setCursorChartData] = useState<IChartItemExtraData | null>(null);

  return (
    <Stats.Wrapper>
      <Stats.Header>
        <Stats.SelectorWrapper>
          <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
            <Typography variant="h6" whiteSpace="nowrap">
              Smart Vault Performance
            </Typography>

            {!isMobile && (
              <PillSelect
                value={chartMode}
                options={chartModeOptions}
                onChange={onChartModeChange}
              />
            )}
          </Stack>
        </Stats.SelectorWrapper>

        <Stats.SelectorWrapper>
          {!isMobile && (
            <PillSelect
              value={intervalType}
              options={chartIntervalOptions}
              onChange={onIntervalTypeChange}
            />
          )}
        </Stats.SelectorWrapper>
      </Stats.Header>
      <TradingWalletStatsContent
        chartData={chartData}
        chartMode={chartMode}
        isLoading={isLoading}
        setCursorChartData={setCursorChartData}
      />
    </Stats.Wrapper>
  );
};

Stats.Header = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0 0.5rem;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing(2)};
  }
`;

Stats.Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: visible;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
`;

Stats.SelectorWrapper = styled('div')`
  margin-top: 0.9rem;
`;

export default Stats;
