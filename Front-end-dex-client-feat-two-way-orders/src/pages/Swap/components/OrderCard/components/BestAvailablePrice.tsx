import { Grid, styled, Switch, Typography } from '@mui/material';
import { FC } from 'react';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';

type BestAvailablePriceProps = {
  checked: boolean;

  handleChange: () => void;
};

const BestAvailablePrice: FC<BestAvailablePriceProps> = ({ checked, handleChange }) => (
  <Grid container alignItems="center" margin="20px 0 10px" justifyContent="space-between">
    <Grid display="flex" flexDirection="row" gap="5px" alignItems="center">
      <Typography variant="statusCard" color="#C4CFF5">
        Best available price
      </Typography>

      <Tooltip title="Shows the best market price that’s currently available for the selected trading pair.">
        <InfoIconWrapper height="16px">
          <InfoIcon />
        </InfoIconWrapper>
      </Tooltip>
    </Grid>

    <SwitchWrapper checked={checked} onChange={handleChange} />
  </Grid>
);

const SwitchWrapper = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',

  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },

  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#EAEBEE',

      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#4C54F5',
      },
    },
  },

  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },

  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: '#323F62',
    boxSizing: 'border-box',
  },
}));

const InfoIconWrapper = styled(Grid)({
  svg: {
    display: 'block',
  },
});

export default BestAvailablePrice;
