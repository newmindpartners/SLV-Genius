import { Grid, Typography } from '@mui/material';
import { FC } from 'react';

const EmptyRewards: FC = () => (
  <Grid container justifyContent="center" gap="30px" mt="50px" mb="50px">
    <img
      src="/images/earnIllustrations/MyDEXRewardsCoins.png"
      alt="My Dex Rewards Staking Coins"
    />
    <Typography
      variant="poweredBy"
      lineHeight="16px"
      color="action.disabledBackground"
      textAlign="center"
    >
      This is where your rewards will be displayed
    </Typography>
  </Grid>
);

export default EmptyRewards;
