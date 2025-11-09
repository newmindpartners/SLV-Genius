import { Grid, styled } from '@mui/material';
import { MouseEvent } from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppBar from '~/components/AppBar/AppBar';
import Footer from '~/components/Footer';
import { LogoIcon } from '~/components/Icons/LogoIcon';

import {
  actions,
  footerLegalLinks,
  footerQuickLinks,
  links,
  redirects,
  socials,
} from './config';
import ResourcesDropdownMenu, {
  resourcesDropdownMenuItems,
} from './ResourcesDropdownMenu';

const DashboardLayout = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleResourcesDropdownMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleResourcesDropdownMenuClose = () => setAnchorEl(null);

  const handleMenuItemClick = (url: string) => {
    const newWindow = window.open(url, '_blank');
    newWindow && newWindow.focus();

    handleResourcesDropdownMenuClose();
  };

  const combinedLinks = [
    ...links,
    <ResourcesDropdownMenu
      key="resourcesDropdownMenu"
      anchorEl={anchorEl}
      menuItems={resourcesDropdownMenuItems}
      open={open}
      onOpen={handleResourcesDropdownMenuClick}
      onClose={handleResourcesDropdownMenuClose}
      onMenuItemClick={handleMenuItemClick}
    />,
  ];

  return (
    <>
      <Grid>
        <AppBarWrapper>
          <AppBar
            logo={<LogoIcon />}
            logoLink={'/swap?from=ADA&to=GENS'}
            links={combinedLinks}
            actions={actions}
          />
        </AppBarWrapper>
        <Grid m="0 auto" width="1440px" maxWidth="100%">
          <InnerWrapper container p={3.25} rowSpacing={6.25}>
            <Grid item xs={12}>
              <Outlet />
            </Grid>
          </InnerWrapper>
          <Footer
            logo={<LogoIcon />}
            links={links}
            footerQuickLinks={footerQuickLinks}
            footerLegalLinks={footerLegalLinks}
            slogan={
              'The all-in-one DeFi platform, that combines an order-book DEX with an AI-powered yield optimizer'
            }
            rightsReserved={'© 2024 Genius Yield - all rights reserved.'}
            copyright={
              'Using Smart Contracts, Tokens, and Crypto is always a risk. Do your own research before investing.'
            }
            redirects={redirects}
            socials={socials}
          />
        </Grid>
      </Grid>
    </>
  );
};

const InnerWrapper = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: '0',
  },
}));

const AppBarWrapper = styled(Grid)(({ theme }) => ({
  '.MuiAppBar-root': {
    backgroundColor: 'transparent',
    boxShadow: 'none',

    [theme.breakpoints.down('sm')]: {
      borderBottom: 'none',

      svg: {
        maxWidth: '150px',
      },

      button: {
        svg: {
          width: '30px',

          path: {
            fill: '#fff',
          },
        },
      },
    },
  },
}));

export default DashboardLayout;
