import { Grid, Typography } from '@mui/material';
import { FC } from 'react';

type HeadingProps = {
  title: string;
  subtitle?: string;
};

const Heading: FC<HeadingProps> = ({ title, subtitle }) => (
  <Grid container gap="8px" mt="14px" direction="column" alignItems="center">
    <Typography
      variant="h4"
      component="h3"
      color="textColor.main"
      align="center"
      fontSize={{ xs: '20px', sm: '24px' }}
      lineHeight={{ xs: '31px', sm: '25px' }}
      fontWeight="800"
    >
      {title}
    </Typography>
    <Typography
      variant="body3"
      component="h4"
      color="buttonsInactive.main"
      align="center"
      fontSize={{ xs: '14px', sm: '16px' }}
      lineHeight={{ xs: '18px', sm: '22px' }}
    >
      {subtitle}
    </Typography>
  </Grid>
);

export default Heading;
