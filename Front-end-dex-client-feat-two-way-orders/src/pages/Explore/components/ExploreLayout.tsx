import { Grid, styled } from '@mui/material';
import { FC, ReactElement, ReactNode } from 'react';
import PageSwitcher from '~/pages/Explore/components/PageSwitcher';

import { dropMenu, dropMenuTitle } from '../mocks';

type ExploreLayoutProps = {
  dropdownTitle: string;
  children: ReactNode;
};

const ExploreLayout: FC<ExploreLayoutProps> = ({
  children,
  dropdownTitle,
}): ReactElement => (
  <Wrapper container>
    <TableHeading alignItems="center" container justifyContent="space-between">
      <PageSwitcher values={dropMenu} title={dropMenuTitle[dropdownTitle] || ''} />
    </TableHeading>
    {children}
  </Wrapper>
);

const Wrapper = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: '0 10px',
    paddingBottom: '30px',
  },
}));

const TableHeading = styled(Grid)(({ theme }) => ({
  padding: '40px 0',

  '.MuiToggleButtonGroup-root': {
    padding: '5px',
    backgroundColor: '#202740',
    borderRadius: theme.borderRadius.xs,
  },

  [theme.breakpoints.down('sm')]: {
    padding: '20px 0',
  },
}));

export default ExploreLayout;
