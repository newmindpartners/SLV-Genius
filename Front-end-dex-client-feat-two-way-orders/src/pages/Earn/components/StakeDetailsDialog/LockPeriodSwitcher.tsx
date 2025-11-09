import { Grid, styled, ToggleButton, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import { Info } from '~/components/Icons/Icons';
import ToggleGroup from '~/components/Toggle/Toggle';
import Tooltip from '~/components/Tooltip';
import { StakeVaultLockDuration } from '~/redux/api';

type LockPeriodSwitcherProps = {
  lockDurationOptions: StakeVaultLockDuration[];
  handleLockPeriodChange: (
    _: MouseEvent<HTMLElement>,
    period: StakeVaultLockDuration,
  ) => void;
  lockPeriod?: StakeVaultLockDuration | null;
};

const periodsMap = {
  MONTHS_1: '1m',
  MONTHS_3: '3m',
  MONTHS_6: '6m',
  MONTHS_9: '9m',
  MONTHS_12: '12m',
  FLEX: 'Flex',
};

const LockPeriodSwitcher = ({
  lockDurationOptions,
  lockPeriod,
  handleLockPeriodChange,
}: LockPeriodSwitcherProps) => (
  <Grid item container direction="row" columnSpacing={1} alignItems="center">
    <Grid item container flexWrap="nowrap" xs={6} alignItems="center" columnGap={'6px'}>
      <Grid item>
        <Typography variant="body3">Lock period:</Typography>
      </Grid>
      <Grid item>
        <Tooltip title="Be aware that tokens and NFTs can’t be unstaked until the lock period is over.">
          <InfoButton>
            <Info />
          </InfoButton>
        </Tooltip>
      </Grid>
    </Grid>
    <TabWrapper item container xs={6} justifyContent="flex-end">
      <ToggleGroup
        tabs={lockDurationOptions.map((duration) => (
          <ToggleButtonItem value={duration} key={duration}>
            <Typography variant="tabsOnProjectsPage">{periodsMap[duration]}</Typography>
          </ToggleButtonItem>
        ))}
        onChange={handleLockPeriodChange}
        activeTab={lockPeriod || lockDurationOptions[0]}
      />
    </TabWrapper>
  </Grid>
);

const TabWrapper = styled(Grid)({
  '& > div': {
    columnGap: '9px',
  },
});

const ToggleButtonItem = styled(ToggleButton)(() => ({
  color: '#fff',
  border: 'none !important',
  boxShadow: 'none !important',
  textTransform: 'none',
  textDecoration: 'none',
  background: '#28304E',
  borderRadius: '8px !important',
  alignSelf: 'flex-end',
  height: '38px',

  '&.Mui-selected': {
    color: '#fff',
    background: '#4C54F5',
    borderRadius: '8px !important',

    '&:hover': {
      color: '#fff',
      background: '#4C54F5',
    },
  },
}));

const InfoButton = styled('div')({
  display: 'flex',
  cursor: 'pointer',
  transform: 'scale(0.8)',
});

export default LockPeriodSwitcher;
