import { Stack, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { Card } from '~/components/Card';
import { PillSelect } from '~/pages/Leaderboard/components/PillSelect';
import { IChartItemExtraData } from '~/pages/Leaderboard/types/IChartItem';
import { Asset } from '~/redux/api';
import { IntervalType } from '~/utils/interval';

import { chartIntervalOptions, chartModeOptions } from '../../constants';
import { IChartData } from '../../helpers/getChartItemsByMode';
import { ChartMode } from '../../types/ChartMode';
import TradingWalletFees from '../TradingWalletFees';
import TradingWalletStatsContent from '../TradingWalletStatsContent';

export interface TradingWalletStatsProps {
  chartData: IChartData;
  chartMode: ChartMode;
  assetPair: {
    assetOne: Asset | undefined;
    assetTwo: Asset | undefined;
  };
  intervalType: IntervalType;
  isLoading: boolean;
  onChartModeChange: (mode: ChartMode) => void;
  onIntervalTypeChange: (interval: IntervalType) => void;
}

export const TradingWalletStats = ({
  chartData,
  chartMode,
  assetPair,
  intervalType,
  isLoading,
  onChartModeChange,
  onIntervalTypeChange,
}: TradingWalletStatsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [cursorChartData, setCursorChartData] = useState<IChartItemExtraData | null>(
    null,
  );

  const { assetOne, assetTwo } = assetPair;

  return (
    <TradingWalletStats.Wrapper>
      <TradingWalletStats.Header>
        <TradingWalletStats.SelectorWrapper>
          <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
            <Typography variant="h6" whiteSpace="nowrap">
              Bot stats
            </Typography>

            {!isMobile && (
              <PillSelect
                value={chartMode}
                options={chartModeOptions}
                onChange={onChartModeChange}
              />
            )}
          </Stack>
        </TradingWalletStats.SelectorWrapper>

        {assetOne && assetTwo && cursorChartData && (
          <TradingWalletFees
            assetPair={{ assetOne, assetTwo }}
            cursorChartData={cursorChartData}
          />
        )}

        <TradingWalletStats.SelectorWrapper>
          {!isMobile && (
            <PillSelect
              value={intervalType}
              options={chartIntervalOptions}
              onChange={onIntervalTypeChange}
            />
          )}
        </TradingWalletStats.SelectorWrapper>
      </TradingWalletStats.Header>
      <TradingWalletStatsContent
        chartData={chartData}
        chartMode={chartMode}
        isLoading={isLoading}
        setCursorChartData={setCursorChartData}
      />
    </TradingWalletStats.Wrapper>
  );
};

TradingWalletStats.Header = styled('div')`
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

TradingWalletStats.Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: visible;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
`;

TradingWalletStats.SelectorWrapper = styled('div')`
  margin-top: 0.9rem;
`;
