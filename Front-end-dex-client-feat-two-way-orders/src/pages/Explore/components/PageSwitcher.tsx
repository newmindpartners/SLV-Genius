import { Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { FC, MouseEvent, ReactElement, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DropMenu } from '~/components/Icons/DropMenu';

type PageSwitcherProps = {
  title: string;
  values: {
    title: string;
    link: string;
  }[];
};

const PageSwitcher: FC<PageSwitcherProps> = ({ title, values }): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const menuButtonId = 'page-switcher-customized-button';

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid position="relative" display="flex" justifyContent="space-between" width="100%">
      <MenuButton
        id={menuButtonId}
        aria-controls={isOpen ? menuButtonId : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        variant="contained"
        disableElevation
        disableRipple={true}
        onClick={handleClick}
        endIcon={<DropMenu />}
      >
        <Typography variant="secondaryBanner" component="h3" color="textColor.main">
          {title}
        </Typography>
      </MenuButton>
      <StyledMenu
        id={menuButtonId}
        MenuListProps={{
          'aria-labelledby': menuButtonId,
        }}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
      >
        {values.map(({ title, link }) => (
          <NavLink to={link} key={title}>
            <MenuItem onClick={handleClose} disableRipple>
              <Typography variant="statusCard" component="h4">
                {title}
              </Typography>
            </MenuItem>
          </NavLink>
        ))}
      </StyledMenu>
    </Grid>
  );
};

const MenuButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  border: '1px solid transparent',
  textTransform: 'capitalize',
  borderWidth: '0px',
  padding: '0',

  svg: {
    marginLeft: '8px',
  },

  ':hover': {
    borderWidth: '0px',
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.xs,
  },

  [theme.breakpoints.down('sm')]: {
    '& > h3': {
      fontSize: '30px',
    },
  },
}));

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: 260,
    backgroundColor: 'transparent',
    '& .MuiMenu-list': {
      padding: '7px',
      borderRadius: theme.borderRadius.md,
      backgroundColor: '#172239',
      border: `1px solid #28304E`,
    },
    '& .MuiMenuItem-root': {
      padding: '11px 14px',
      ':hover': {
        backgroundColor: '#28304E',
        borderRadius: theme.borderRadius.xs,
      },
      'a h4': {
        display: 'block',
        width: '100%',
        color: theme.palette.textColor.main,
        fontWeight: '600',
      },
    },
  },
}));

export default PageSwitcher;
