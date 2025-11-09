import { GlobalStylesProps, PaletteColor } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';

export const generateGlobalStyles = (_theme: Theme): GlobalStylesProps['styles'] => ({
  '*': {
    padding: 0,
    margin: 0,
    '*, *:after, *:before': {
      boxSizing: 'border-box',
    },
  },
  body: {
    backgroundColor: _theme.palette.background.default,
  },
  a: {
    textDecoration: 'none',
  },
});

const {
  palette: { augmentColor },
} = createTheme();
export const createColor = (mainColor: string): PaletteColor =>
  augmentColor({ color: { main: mainColor } });
