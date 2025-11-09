import { Link, AppBar as MUIAppBar } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { FC } from 'react';

import Drawer from './Drawer';

export type AppBarProps = {
  logo: React.ReactElement;
  logoLink: string;
  links: React.ReactElement[];
  actions: React.ReactElement[];
  position?: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';
};

const AppBar: FC<AppBarProps> = ({
  logo,
  logoLink,
  links,
  actions,
  position = 'static',
}) => (
  <StyledAppBar position={position}>
    <Container>
      <Toolbar disableGutters>
        <NavMenu>
          <Link display="flex" alignItems="center" alignContent="center" href={logoLink}>
            {logo}
          </Link>
          <MenuItemList>{links}</MenuItemList>
        </NavMenu>
        <DrawerWrapper>
          <Drawer links={links} actions={actions} logo={logo} />
        </DrawerWrapper>
        <ButtonWrapper>{actions}</ButtonWrapper>
      </Toolbar>
    </Container>
  </StyledAppBar>
);

const StyledAppBar = styled(MUIAppBar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.lines.main}`,
  padding: '15px 0',
  backgroundColor: theme.palette.bgColor.main,
  backgroundImage: 'none',
}));

const NavMenu = styled(Box)({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  alignContent: 'center',
});

const MenuItemList = styled('ul')(({ theme }) => ({
  display: 'flex',
  margin: '0 40px',
  marginLeft: '80px',

  '& li ': {
    margin: '0 3px',
    borderRadius: theme.borderRadius.sm,
  },

  '& li a': {
    textDecoration: 'none',
  },

  '& li a span': {
    color: theme.palette.buttonsInactive.main,
  },

  '& a.active:before': {
    content: '""',
    position: 'absolute',
    width: '6px',
    height: '6px',
    backgroundColor: theme.palette.secondary.main,
    bottom: '-13px',
    left: 'calc(50% - 2.75px)',
    borderRadius: '50%',
  },

  '& a.active span': {
    color: theme.palette.textColor.main,
  },

  [theme.breakpoints.down(1000)]: {
    marginLeft: '20px',
  },

  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const DrawerWrapper = styled(Box)(({ theme }) => ({
  display: 'none',
  flexGrow: 0,

  [theme.breakpoints.down('md')]: {
    display: 'flex',
  },
}));

export default AppBar;
