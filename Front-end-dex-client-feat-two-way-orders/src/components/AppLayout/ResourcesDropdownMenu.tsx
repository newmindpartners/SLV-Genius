import { Button, Grid, Menu, MenuItem, styled, Typography } from '@mui/material';
import { shouldForwardProp } from '@mui/system';
import { map } from 'lodash';
import React, { FC } from 'react';
import DownArrowSVG from '~/components/Icons/DownArrowSVG';
import ExternalLinkArrowSVG from '~/components/Icons/ExternalLinkArrowSVG';

import { ROUTES } from './config';

type DropdownMenuItemContentProps = {
  title: React.ReactNode;
};

const DropdownMenuItemContent: FC<DropdownMenuItemContentProps> = ({ title }) => (
  <Grid container alignItems="center" width="190px" gap="5px">
    <Typography variant="subtitle1">{title}</Typography>
    <ExternalLinkArrowSVG />
  </Grid>
);

type MenuItem = {
  title: React.ReactNode;
  url: string;
};

type ResourcesDropdownMenuProps = {
  anchorEl: null | HTMLElement;
  menuItems: MenuItem[];
  open: boolean;
  onOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
  onMenuItemClick: (url: string) => void;
};

export const resourcesDropdownMenuItems = [
  {
    title: 'Market Maker Bots',
    url: 'https://www.geniusyield.co/marketmakerbot?lng=nl',
  },
  {
    title: 'Smart Order Routers',
    url: 'https://www.geniusyield.co/smartorderrouter?lng=nl',
  },
  {
    title: 'Atlas PAB',
    url: 'https://atlas-app.io/',
  },
  {
    title: 'DAO',
    url: 'https://www.clarity.vote/organizations/GeniusYieldDAO',
  },
  {
    title: 'Docs',
    url: 'https://docs.geniusyield.co/',
  },
  {
    title: 'White Paper',
    url: 'https://www.geniusyield.co/whitepaper.pdf?lng=en-GB',
  },
  {
    title: 'Release Notes',
    url: ROUTES.RELEASE_NOTES,
  },
];

const ResourcesDropdownMenu: FC<ResourcesDropdownMenuProps> = ({
  anchorEl,
  menuItems,
  open,
  onOpen,
  onClose,
  onMenuItemClick,
}) => {
  return (
    <Container>
      <ButtonWrapper
        aria-controls="resources-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={onOpen}
        color="inherit"
        disableRipple
        variant="text"
        endIcon={
          <RotateIconWrapper isDropdownOpen={open}>
            <DownArrowSVG />
          </RotateIconWrapper>
        }
      >
        <Typography variant="subtitle1">Resources</Typography>
      </ButtonWrapper>
      <MenuWrapper
        id="resources-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': 'dropdown-trigger',
        }}
      >
        {map(menuItems, (item, index) => (
          <MenuItem
            key={`dropdown-item-${index}`}
            onClick={() => onMenuItemClick(item.url)}
          >
            <DropdownMenuItemContent title={item.title} />
          </MenuItem>
        ))}
      </MenuWrapper>
    </Container>
  );
};

const Container = styled(Grid)(({ theme }) => ({
  '& > .MuiButton-root': {
    textTransform: 'capitalize',
    borderRadius: theme.borderRadius.sm,
    border: 'none',
    padding: '6px 16px',
  },
}));

const ButtonWrapper = styled(Button)(() => ({
  '& > .MuiButton-endIcon > .MuiGrid-root': {
    display: 'flex',
    alignItems: 'center',
  },
}));

const RotateIconWrapper = styled(Grid, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'isDropdownOpen',
})<{ isDropdownOpen?: boolean }>(({ isDropdownOpen }) => ({
  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.3s',
}));

const MenuWrapper = styled(Menu)(({ theme }) => ({
  marginTop: '10px',

  '.MuiPaper-root': {
    background: theme.palette.bgCardColor.dark,
    border: `1px solid ${theme.palette.bgCardColor.dark}`,
    boxShadow: `0 px 16px 10px ${theme.palette.bgCardColor.dark}`,

    '& > ul': {
      padding: '8px 10px',
      '& > li': {
        borderRadius: theme.borderRadius.sm,
      },
    },
  },
}));

export default ResourcesDropdownMenu;
