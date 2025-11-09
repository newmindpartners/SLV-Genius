import { Grid, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { CoinsIcon } from '~/components/Icons/CoinsIcon';
import { SmartVault } from '~/redux/api';
import { formatDate } from '~/utils/dateUtils';

import { SubtleDescription as Label, Description as Value } from './Typography';

type Props = Pick<SmartVault, 'created' | 'smartVaultStrategy'>;

const Content: FC<Props> = ({ created, smartVaultStrategy }) => (
  <Wrapper>
    <Metric>
      <Label>Strategy</Label>
      <Value>{smartVaultStrategy?.name || '-'}</Value>
    </Metric>

    <Metric>
      <Label>TVL</Label>
      <Value>-</Value>
    </Metric>

    <Metric>
      <Label>APY boost</Label>
      <Value>-</Value>
    </Metric>

    <Metric>
      <Label>Created</Label>
      <Value>{formatDate(new Date(created))}</Value>
    </Metric>

    <StyledDivider />

    <Grid>
      <Label>Available withdraw amount:</Label>

      <Grid container item justifyContent="space-between" wrap="nowrap">
        <Grid item flex={1}>
          <Label>-</Label>
        </Grid>
        <Rewards>
          <CoinsIcon />
          <RewardsValue>-</RewardsValue>
        </Rewards>
      </Grid>
    </Grid>
  </Wrapper>
);

const Rewards = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}));

const RewardsValue = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: '17px',
  lineHeight: '24px',
  color: '#6AFFA6',
}));

const StyledDivider = styled('div')(() => ({
  width: '100%',
  height: 1,
  backgroundColor: '#2E3D60',
  margin: '4px 0',
}));

export const ChangeText = styled('span')<{ isPositive: boolean }>(({ isPositive }) => ({
  color: isPositive ? '#6AFFA6' : '#E66170',
}));

const Wrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginTop: 24,
  marginBottom: 20,
  gap: 12,
}));

const Metric = styled(Grid)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
}));

export default Content;
