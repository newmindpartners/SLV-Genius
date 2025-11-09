import { Grid, styled, Typography } from '@mui/material';
import moment from 'moment';
import { FC, ReactNode } from 'react';
import { Info } from '~/components/Icons/Icons';
import Tooltip from '~/components/Tooltip';
import { StakeVaultLockDuration } from '~/redux/api';

import { CardProps as ParentProps } from '.';
import { SubtleDescription } from './Typography';

const Top = styled(Grid)(() => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const LogoWrapper = styled(Grid)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const Logo = styled('img')(() => ({
  width: 42.79,
  height: 43.35,
  marginRight: 15,
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontFamily: ['Mulish', 'sans-serif'].join(','),
  fontWeight: 800,
  fontSize: '19px',
  lineHeight: '28.76px',
}));

const ExpirationDate = styled(Typography)(() => ({
  color: '#B9CAED',
  fontFamily: ['Mulish', 'sans-serif'].join(','),
  fontWeight: 500,
  fontSize: '13px',
  lineHeight: '22px',
}));

const ExpirationDuration = styled(ExpirationDate)({
  border: '1px solid #403DE4',
  padding: '1px 0',
  marginBottom: '2px',
  color: '#fff',
  borderRadius: '6px',
  minWidth: '40px',
  textAlign: 'center',
});

const getLockDurationFormatted = (lockDuration: StakeVaultLockDuration) => {
  switch (lockDuration) {
    case 'MONTHS_1':
      return '1m';
    case 'MONTHS_3':
      return '3m';
    case 'MONTHS_6':
      return '6m';
    case 'MONTHS_9':
      return '9m';
    case 'MONTHS_12':
      return '12m';
    case 'FLEX':
      return 'Flex';
  }
};

const LockedInfo = ({
  lockedUntil,
  lockDuration,
}: {
  lockedUntil: Date | undefined;
  lockDuration: StakeVaultLockDuration;
}) => {
  const lockDurationFormatted = getLockDurationFormatted(lockDuration);
  const mLockedUntil = moment(lockedUntil);
  const mDuration = moment.duration(mLockedUntil.diff(moment.now()));

  const monthsLeft = mDuration.months();
  const daysLeft = mDuration.days();
  const hoursLeft = mDuration.hours();
  const minutesLeft = mDuration.minutes();

  const monthsLeftFormatted = monthsLeft > 0 ? `${monthsLeft}m ` : '';
  const daysLeftFormatted = daysLeft > 0 ? `${daysLeft}d ` : '';
  const hoursLeftFormatted = hoursLeft > 0 ? `${hoursLeft}h ` : '';
  const minutesLeftFormatted = minutesLeft > 0 ? `${minutesLeft}m ` : '';
  const noLongerLocked = mDuration.asSeconds() <= 0;

  const lockedUntilDuration = `${monthsLeftFormatted}${daysLeftFormatted}${hoursLeftFormatted}${minutesLeftFormatted} left`;
  const lockedUntilDate = moment(lockedUntil).format('ll');

  const lockedUntilFormatted = noLongerLocked
    ? 'Unlocked'
    : monthsLeft > 0
    ? lockedUntilDate
    : lockedUntilDuration;

  return (
    <>
      {lockDurationFormatted && (
        <ExpirationDuration>{lockDurationFormatted}</ExpirationDuration>
      )}
      <ExpirationDate>{lockedUntilFormatted}</ExpirationDate>
    </>
  );
};

type LockPeriodProps = {
  lockedUntil: Date | undefined;
  lockDuration: StakeVaultLockDuration;
};

const LockPeriod = ({ lockedUntil, lockDuration }: LockPeriodProps) =>
  lockedUntil ? (
    <LockedInfo lockedUntil={lockedUntil} lockDuration={lockDuration} />
  ) : (
    <img alt="button with addition sign" src="/images/staking-flex-icon.svg" />
  );

type CardHeaderProps = {
  assetLogoUrl: string;
  warning: ReactNode;
  lockDuration: StakeVaultLockDuration | undefined;
} & Pick<ParentProps, 'assetShortName' | 'lockedUntil' | 'isUnstaked'>;

export const CardHeader: FC<CardHeaderProps> = ({
  assetShortName,
  lockedUntil,
  assetLogoUrl,
  isUnstaked,
  lockDuration,
  warning,
}) => (
  <Top>
    <LogoWrapper item>
      <Logo src={assetLogoUrl} />
      <Title>{assetShortName}</Title>
    </LogoWrapper>
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="flex-end"
      height={50}
    >
      {isUnstaked ? (
        <SubtleDescription>Unstaked</SubtleDescription>
      ) : (
        <>
          {warning && (
            <Tooltip title={warning} placement="left">
              <InfoButton>
                <Info />
              </InfoButton>
            </Tooltip>
          )}
          {lockDuration && (
            <LockPeriod lockedUntil={lockedUntil} lockDuration={lockDuration} />
          )}
        </>
      )}
    </Grid>
  </Top>
);

const InfoButton = styled('div')({
  cursor: 'pointer',
  marginLeft: '20px',
  transform: 'translate(20px, -10px) scale(0.8)',
});
