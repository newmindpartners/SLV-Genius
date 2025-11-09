import { Grid, styled } from '@mui/material';
import { map } from 'lodash';
import { FC } from 'react';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';

import { ChartOptions } from '.';
import BinSizeSelector from './BinSizeSelector';
import ChartOptionSelector from './ChartOptionSelector';
import { BinInterval, ChartType, TimeInterval } from './utils';

export type ChartOptionsProps = {
  chartTypeFields: ChartType[];
  timeframeFields: TimeInterval[];

  selectedChartOptions: ChartOptions;
  setSelectedChartOptions: (options: ChartOptions) => void;
  selectedBinInterval: BinInterval;
  setSelectedBinInterval: (binInterval: BinInterval) => void;

  startTime: Date;
  endTime: Date;
};

const ChartOptionsHeader: FC<ChartOptionsProps> = ({
  timeframeFields,
  chartTypeFields,

  selectedChartOptions,
  setSelectedChartOptions,
  selectedBinInterval,
  setSelectedBinInterval,

  startTime,
  endTime,
}) => {
  const handleTimeframeOptionClick = (timeframe: TimeInterval) => {
    setSelectedChartOptions({
      ...selectedChartOptions,
      timeFrame: timeframe,
    });
  };

  const handleChartTypeOptionClick = (chartType: ChartType) => {
    setSelectedChartOptions({
      ...selectedChartOptions,
      chartType: chartType,
    });
  };

  const marketDataTooltip =
    'Market data is calculated by averaging order price within time bins determined by the selected time window';

  const marketDataChartTooltip =
    'Due to the decentralized nature of the exchange a filter has been applied to the market data to improve the chart readability';

  return (
    <Container display="flex" flexDirection="row" justifyContent="space-between">
      {/* Left Side */}
      <Grid
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="max-content"
      >
        <Grid display="flex" width="fit-content" gap="5px" alignItems="center" mr="10px">
          {map(timeframeFields, (timeframe) => (
            <ChartOptionSelector
              key={timeframe}
              selector={timeframe}
              isActive={timeframe === selectedChartOptions.timeFrame}
              onClick={() => handleTimeframeOptionClick(timeframe)}
            />
          ))}
        </Grid>

        <Tooltip title={marketDataTooltip} placement="right">
          <Grid display="flex" alignItems="center">
            <InfoIcon />
          </Grid>
        </Tooltip>
      </Grid>

      <RightSide
        display="flex"
        gap="15px"
        alignItems="center"
        width="fit-content"
        marginX="15px"
      >
        <BinSizeSelector
          selectedBinInterval={selectedBinInterval}
          setSelectedBinInterval={setSelectedBinInterval}
          startTime={startTime}
          endTime={endTime}
        />

        <GreyDivider />

        <Grid
          container
          display="flex"
          minWidth="168px"
          alignSelf="flex-end"
          gap="10px"
          width="max-content"
        >
          {map(chartTypeFields, (chartType) => (
            <ChartOptionSelector
              key={chartType}
              selector={chartType}
              isActive={chartType === selectedChartOptions.chartType}
              onClick={() => handleChartTypeOptionClick(chartType)}
            />
          ))}

          <Tooltip title={marketDataChartTooltip} placement="right">
            <Grid display="flex" alignItems="center">
              <InfoIcon />
            </Grid>
          </Tooltip>
        </Grid>
      </RightSide>
    </Container>
  );
};

const Container = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    gap: 20,
  },
}));

const RightSide = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: 'max-content',
  },

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',

    '& > .MuiGrid-root': {
      width: 'max-content',
    },
  },
}));

const GreyDivider = styled(Grid)(({ theme }) => ({
  width: 1,
  height: 25,
  backgroundColor: theme.palette.buttonsInactive.dark,
  margin: 'auto',

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export default ChartOptionsHeader;
