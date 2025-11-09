import { Grid, styled, Typography } from '@mui/material';
import React, { FC, ReactElement } from 'react';
import { SearchIcon } from '~/components/Icons/SearchIcon';

type NoResultsTableProps = {
  title: string;
  description: string;
};

const NoResultsTable: FC<NoResultsTableProps> = ({
  title,
  description,
}): ReactElement => (
  <Wrapper
    margin="0 auto"
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
      maxWidth="375px"
      color="buttonsInactive.main"
      mt="22px"
      variant="body3"
      component="h4"
      textAlign="center"
    >
      {description}
    </Typography>
  </Wrapper>
);

const Wrapper = styled(Grid)(({ theme }) => ({
  backgroundColor: '#202740',
  borderRadius: theme.borderRadius.md,
  height: '50vh',
}));

export default NoResultsTable;
