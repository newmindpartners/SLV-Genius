import { Grid, Typography } from '@mui/material';
import { FC, ReactElement } from 'react';
import { SearchIcon } from '~/components/Icons/SearchIcon';

type NoChartResultsProps = {
  title: string;
  description: string;
};

const NoChartResults: FC<NoChartResultsProps> = ({
  title,
  description,
}): ReactElement => (
  <Grid
    height="450px"
    margin="auto"
    container
    direction="column"
    alignItems="center"
    justifyContent="center"
  >
    <SearchIcon />
    <Typography mt="35px" variant="h3" component="h3" color="textColor.main">
      {title}
    </Typography>
    <Typography
      maxWidth="400px"
      color="buttonsInactive.main"
      mt="22px"
      variant="body3"
      component="h4"
      textAlign="center"
    >
      {description}
    </Typography>
  </Grid>
);

export default NoChartResults;
