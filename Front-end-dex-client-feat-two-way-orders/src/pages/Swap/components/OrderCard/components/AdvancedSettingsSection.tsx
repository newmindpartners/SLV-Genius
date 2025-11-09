import { Grid, styled, Typography } from '@mui/material';
import { FC } from 'react';
import Button from '~/components/Button/Button';
import Chip from '~/components/Chip/Chip';
import { RightArrow } from '~/components/Icons/RightArrow';
import { AdvancedSettings } from '~/context/advancedSettingsContext';
import { formatDate } from '~/utils/dateUtils';

type AdvancedSettingsSectionProps = {
  advancedSettings: AdvancedSettings;
  handleOpenAdvancedSettings: () => void;
};

const AdvancedSettingsSection: FC<AdvancedSettingsSectionProps> = ({
  advancedSettings,
  handleOpenAdvancedSettings,
}) => {
  const { startDate, endDate } = advancedSettings;

  return (
    <Grid container direction="column">
      <AdvancedSettingsButton onClick={handleOpenAdvancedSettings}>
        <Typography variant="body3" color="bgPrimaryGradient.contrastText">
          Advanced settings
        </Typography>
        <RightArrow />
      </AdvancedSettingsButton>

      <ChipsGrid>
        {startDate && <SettingsChip title={'Start Date'} text={formatDate(startDate)} />}
        {endDate && <SettingsChip title={'End Date'} text={formatDate(endDate)} />}
      </ChipsGrid>
    </Grid>
  );
};

type SettingsChipProps = {
  title: string;
  text: string;
};

const SettingsChip: FC<SettingsChipProps> = ({ title, text }) => (
  <CustomChip
    type="default"
    label={<ChipLabel title={`${title}:`} text={text} />}
    variant="filled"
  />
);

type ChipLabelProps = {
  title: string;
  text: string;
};

const ChipLabel: FC<ChipLabelProps> = ({ title, text }) => (
  <Grid display="flex" gap="5px" alignItems="center">
    <SecondaryText variant="poweredBy">{title}</SecondaryText>
    <PrimaryText variant="poweredBy">{text}</PrimaryText>
  </Grid>
);

const SecondaryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.action.disabled,
  lineHeight: '16px',
}));

const PrimaryText = styled(SecondaryText)(({ theme }) => ({
  color: theme.palette.action.disabledBackground,
  fontWeight: '600',
}));

const CustomChip = styled(Chip)(() => ({
  backgroundColor: '#28304E',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'min-content',
  '& svg': { display: 'none' },
  '&:hover': {
    background: '#28304E',
    boxShadow: 'none',
  },
}));

const ChipsGrid = styled(Grid)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '15px',
}));

const AdvancedSettingsButton = styled(Button)(({ theme }) => ({
  padding: '0',
  background: 'none',
  width: 'fit-content',
  textAlign: 'left',
  marginTop: '20px',

  '& span': {
    color: '#4C54F5',
    fontSize: '14px',
  },

  svg: {
    marginLeft: '10px',
    transform: 'translateY(1px)',
    width: '6px',

    '& path': {
      stroke: '#4C54F5',
    },
  },

  '&:hover': {
    background: 'transparent',
    boxShadow: 'none',
  },

  [theme.breakpoints.down('md')]: {
    padding: '0',
  },
}));

export default AdvancedSettingsSection;
