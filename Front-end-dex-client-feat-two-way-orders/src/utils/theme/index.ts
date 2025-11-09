import { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material';

import { getDarkCustomPalette } from './custom-palettes/dark';
import { getLightCustomPalette } from './custom-palettes/light';
import { Palette } from './Types';
import { typography as uiKitTypography } from './typography';

export { createColor, generateGlobalStyles } from './utils';

const getUIKitPalette = (mode: PaletteMode): Palette => ({
  ...(mode === 'light' ? getLightCustomPalette() : getDarkCustomPalette()),
  mode,
});

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        color: '#ffffff',
        border: '1px solid #6574A7',
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        padding: '36px',
        backgroundColor: '#18182B',
      },
    },
  },
};

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1440,
    xl: 1600,
  },
};

const borderRadius = {
  xs: '9px',
  sm: '12px',
  md: '16px',
  lg: '30px',
  xl: '100px',
};

const getPalette = (mode: PaletteMode) => {
  const uiKitPalette = getUIKitPalette(mode);
  const customLightPalette = {};
  const customDarkPalette = {
    primary: {
      main: '#59EECA',
      dark: '#59D3EE',
    },
    grey: {
      100: '#C1CEF1',
    },
    gray: {
      light: '#C1CEF1',
    },

    bgPrimaryGradient: {
      main: 'rgba(89, 238, 202, 0.7)',
      contrastText: '#151D2E',
      gradient: 'linear-gradient(90deg, #59EECA 0%, #59D3EE 100%)',
    },

    background: {
      default: '#050518',
    },

    progressRedGradient: {
      main: '#59EECA',
      secondary: '#ffffff',
    },

    success: {
      main: '#59EECA',
    },

    error: {
      main: '#FF4F6E',
    },

    chip: {
      default: {
        ...uiKitPalette.chip.default,
        color: '#C1CEF1',
      },
      error: {
        ...uiKitPalette.chip.error,
        color: '#FF4F6E',
      },
      info: {
        ...uiKitPalette.chip.info,
        color: '#5055e9',
      },
      success: {
        ...uiKitPalette.chip.info,
        color: '#59EECA',
      },
      warning: {
        ...uiKitPalette.chip.warning,
        color: '#F0F287',
      },
    },
  };

  return {
    ...uiKitPalette,
    ...(mode === 'light' ? customLightPalette : customDarkPalette),
    mode,
  };
};

export const createThemeWithMode = (mode: PaletteMode) =>
  createTheme({
    components,
    typography: {
      ...uiKitTypography,
      fontFamily: ['Mulish', 'sans-serif'].join(','),
      secondaryFont: ['Mulish', 'sans-serif'].join(','),
      h3: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontWeight: 700,
        fontSize: '30px',
        lineHeight: '46px',
      },
      mainBanner: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '55px',
        lineHeight: '65px',
      },

      secondaryBanner: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontStyle: 'normal',
        fontWeight: 900,
        fontSize: 44,
        lineHeight: '52px',
      },

      description: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontStyle: 'normal',
        fontWeight: 300,
        fontSize: '14px',
        lineHeight: '25px',
      },
      statusCard: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontStyle: 'normal',
        fontWeight: 300,
        fontSize: '14px',
        lineHeight: '18px',
      },

      tabsOnProjectsPage: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '15px',
        lineHeight: '44px',
      },

      body3: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '21px',
      },

      roundWrapperCardTitle: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontWeight: 400,
        fontSize: '17px',
        lineHeight: '31px',
      },

      roundWrapperCardDesc: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '23px',
      },

      upcomingCardTimer: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontWeight: 300,
        fontSize: '23px',
        lineHeight: '23px',
      },

      teamUserTitle: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '37px',
      },

      poweredBy: {
        fontFamily: ['Mulish', 'sans-serif'].join(','),
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '23px',
      },
    },
    breakpoints,
    borderRadius,
    palette: {
      ...getPalette(mode),
      mode,
    },
  });
