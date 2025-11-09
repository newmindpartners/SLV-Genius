import { FormControl, Grid, MenuItem, Select, styled, Typography } from '@mui/material';
import { filter, inRange, map } from 'lodash';
import { FC } from 'react';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';

import {
  BIN_INTERVAL_MAP,
  BIN_INTERVAL_MAX_LIMIT,
  BIN_INTERVAL_MIN_LIMIT,
  BinInterval,
  isBinInterval,
} from './utils';

const binSizeSelectorTooltip =
  'Choose the granularity of data aggregation for the chart. Smaller bin sizes show more detailed data.';

const getMaximumBinAmount = (
  startTimeDate: Date,
  endTimeDate: Date,
  binInterval: BinInterval,
) => {
  const start = startTimeDate.getTime();
  const end = endTimeDate.getTime();
  const durationMs = end - start;

  const binSizeMs = BIN_INTERVAL_MAP[binInterval];
  return Math.floor(durationMs / binSizeMs);
};

export const isValidBinInterval = (
  startTimeDate: Date,
  endTimeDate: Date,
  binInterval: BinInterval,
) => {
  const bins = getMaximumBinAmount(startTimeDate, endTimeDate, binInterval);
  return inRange(bins, BIN_INTERVAL_MIN_LIMIT, BIN_INTERVAL_MAX_LIMIT + 1);
};

export type BinSizeSelectorProps = {
  selectedBinInterval: BinInterval;
  setSelectedBinInterval: (binInterval: BinInterval) => void;

  startTime: Date;
  endTime: Date;
};

const BinSizeSelector: FC<BinSizeSelectorProps> = ({
  selectedBinInterval,
  setSelectedBinInterval,

  startTime,
  endTime,
}) => (
  <Grid display="flex" alignItems="center" gap="5px" minWidth="130px">
    <Typography
      variant="statusCard"
      align="left"
      color={'buttonsInactive.dark'}
      fontWeight="500"
      lineHeight="16px"
      fontSize="12px"
    >
      {'Bin Size'}
    </Typography>

    <FormControl size="small">
      <StyledSelect
        value={selectedBinInterval}
        onChange={(event) =>
          isBinInterval(event.target.value) && setSelectedBinInterval(event.target.value)
        }
        MenuProps={{
          PaperProps: {
            component: StyledMenuPaper,
          },
        }}
      >
        {map(
          filter(BinInterval, (bin) => isValidBinInterval(startTime, endTime, bin)),
          (bin) => (
            <MenuItem key={bin} value={bin}>
              <Typography
                variant="statusCard"
                align="left"
                color={'buttonsInactive.dark'}
                fontWeight="500"
                lineHeight="16px"
                fontSize="12px"
              >
                {bin}
              </Typography>
            </MenuItem>
          ),
        )}
      </StyledSelect>
    </FormControl>

    <Tooltip title={binSizeSelectorTooltip} placement="right">
      <Grid display="flex" alignItems="center">
        <InfoIcon />
      </Grid>
    </Tooltip>
  </Grid>
);

const StyledSelect = styled(Select)(({ theme }) => ({
  '& > .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },

  '& > .MuiOutlinedInput-input': {
    fontSize: 12,
    padding: '3px 28px 3px 10px !important',
    borderRadius: theme.borderRadius.xs,

    '&:hover': {
      backgroundColor: '#4C54F5',
    },
  },

  '& > .MuiSvgIcon-root': {
    color: theme.palette.buttonsInactive.dark,
    right: 3,
  },

  '&:hover': {
    '& > .MuiOutlinedInput-input': {
      borderRadius: theme.borderRadius.xs,

      '& > .MuiTypography-root': {
        color: theme.palette.textColor.light,
      },
    },

    '& > .MuiSvgIcon-root': {
      color: theme.palette.textColor.light,
    },
  },
}));

const StyledMenuPaper = styled(Grid)(({ theme }) => ({
  backgroundColor: '#172239 !important',
  border: '1px solid #28304E !important',
  borderRadius: `${theme.borderRadius.xs} !important`,

  '& > .MuiList-root': {
    paddingTop: 4,
    paddingBottom: 4,

    '& > .MuiMenuItem-root': {
      margin: '2px 5px',
      padding: '6px',
      display: 'flex',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.xs,

      '&.Mui-selected': {
        backgroundColor: 'rgba(76, 84, 245, 0.7)',
        '& > .MuiTypography-root': {
          color: theme.palette.textColor.light,
        },
      },
    },
  },
}));

export default BinSizeSelector;
