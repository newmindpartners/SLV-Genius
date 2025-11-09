import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Grid, styled } from '@mui/material';
import { Drawer as MUIDrawer } from '@mui/material';
import { map } from 'lodash';
import React, { FC, ReactElement, useState } from 'react';

import IconButton from '../Button/IconButton';

export type DrawerProps = {
  links: React.ReactElement[];
  actions: ReactElement[];
  logo: React.ReactElement;
};

type MenuItemsProps = {
  links: React.ReactElement[];
  actions: ReactElement[];
};

type CloseMenuProps = {
  toggleDrawer: () => void;
};

const Drawer: FC<DrawerProps> = ({ links, actions, logo }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconWrapper>
        <IconButton onClick={toggleDrawer} color="transparent" size="small">
          <MenuIcon />
        </IconButton>
      </IconWrapper>
      <DrawerWrapper open={open} onClose={toggleDrawer} anchor={'top'}>
        <Grid container direction={'column'} spacing={{ md: 3.125, xs: 5.625 }}>
          <Grid
            item
            container
            flexWrap={'nowrap'}
            xs={12}
            justifyContent={'space-between'}
          >
            <Grid item xs={6}>
              {logo}
            </Grid>
            <CloseMenu toggleDrawer={toggleDrawer} />
          </Grid>
          <MenuItems links={links} actions={actions} toggleDrawer={toggleDrawer} />
        </Grid>
      </DrawerWrapper>
    </>
  );
};

const CloseMenu = ({ toggleDrawer }: CloseMenuProps) => (
  <IconWrapper item xs={6} container justifyContent={'end'} alignItems={'center'}>
    <IconButton onClick={toggleDrawer} color="transparent" size="small">
      <CloseIcon height={'2rem'} width={'2rem'} />
    </IconButton>
  </IconWrapper>
);

const MenuItems = ({ links, actions, toggleDrawer }: MenuItemsProps & CloseMenuProps) => (
  <Grid
    container
    item
    direction={'column'}
    alignItems={'center'}
    xs={12}
    spacing={6}
    pb={{ sm: 6 }}
  >
    <Grid item container alignItems={'center'} justifyContent={'center'}>
      <MenuWrapper>
        {map(links, (link, i) => (
          <MenuItem key={i} onClick={toggleDrawer}>
            {link}
          </MenuItem>
        ))}
      </MenuWrapper>
    </Grid>
    {actions && (
      <ButtonWrapper
        item
        container
        spacing={{ xs: 2, sm: 3 }}
        direction={'column'}
        display={{ sm: 'flex', md: 'none' }}
      >
        {map(actions, (item, key) => (
          <Grid item key={key} container alignItems={'center'} justifyContent={'center'}>
            {item}
          </Grid>
        ))}
      </ButtonWrapper>
    )}
  </Grid>
);

const ButtonWrapper = styled(Grid)({
  '& div button': {
    maxWidth: '180px',
    width: '100%',
  },
});

const MenuWrapper = styled(Grid)({
  padding: 0,
});

const MenuItem = styled(Grid)(({ theme }) => ({
  position: 'relative',
  padding: '12px 10px',
  margin: '10px 0',
  listStyle: 'none',

  '& li': {
    borderRadius: theme.borderRadius.sm,
  },

  'a span': {
    color: theme.palette.buttonsInactive.main,
  },

  'a.active span': {
    color: theme.palette.textColor.main,
  },

  'a.active:before': {
    content: '""',
    position: 'absolute',
    width: '6px',
    height: '6px',
    backgroundColor: theme.palette.secondary.main,
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: '1px',
    borderRadius: theme.borderRadius.lg,
  },

  [theme.breakpoints.down('lg')]: {
    a: {
      li: {
        justifyContent: 'center',
      },
    },
  },
}));

const IconWrapper = styled(Grid)({
  '& button svg': {
    height: '38px',
    width: '38px',
  },
});

const DrawerWrapper = styled(MUIDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.bgColor.main,
    padding: '21px 50px',

    [theme.breakpoints.down('md')]: {
      padding: '29px',
    },

    [theme.breakpoints.down('sm')]: {
      padding: '28px 16px 42px',
    },
  },
}));

export default Drawer;
