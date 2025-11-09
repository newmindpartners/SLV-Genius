import { PaletteColor } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';
import { CSSProperties } from 'react';

export type Palette = NonNullable<ThemeOptions['palette']>;

type CustomStatusPaletteColor = {
  main: string;
  transparentBg: string;
  transparentFullBg: string;
};

type CustomGradientPaletteColor = {
  main: string;
  secondary?: string;
  gradient: string;
};

type CustomChipPaletteColor = {
  backgroundColor: string;
  color: string;
};

type CustomChipPalette = {
  default: CustomChipPaletteColor;
  success: CustomChipPaletteColor;
  warning: CustomChipPaletteColor;
  error: CustomChipPaletteColor;
  info: CustomChipPaletteColor;
};

export type CustomPalette = {
  textColor: PaletteColor;
  textColorDescription: PaletteColor;
  buttonsInactive: PaletteColor;
  highlightedFrames: PaletteColor;
  lines: PaletteColor;
  bgColor: PaletteColor;
  bgCardColor: PaletteColor;
  bgCardRoundColor: PaletteColor;
  social: PaletteColor;
  textLowFooter: PaletteColor;
  bgCardGray: PaletteColor;
  progressBackground: PaletteColor;
  progressRedGradient: CustomGradientPaletteColor;
  progressSuccessGradient: CustomGradientPaletteColor;
  successColorStatus: CustomStatusPaletteColor;
  upcomingColorStatus: CustomStatusPaletteColor;
  soldOutColorStatus: CustomStatusPaletteColor;
  bgPrimaryGradient: CustomGradientPaletteColor & { contrastText: string };
  action: {
    disabledBackground: string;
    disabled: string;
  };
  chip: CustomChipPalette;
};

declare module '@mui/material/Typography' {
  export interface TypographyPropsVariantOverrides {
    secondaryFont: true;
    description: true;
    roundWrapperCardTitle: true;
    roundWrapperCardDesc: true;
    upcomingCardTimer: true;
    poweredBy: true;
    tabsOnProjectsPage: true;
    mainBanner: true;
    secondaryBanner: true;
    body3: true;
    teamUserTitle: true;
    textLowFooter: true;
    statusCard: true;
  }
}
declare module '@mui/material/styles' {
  export interface ThemeOptions {
    borderRadius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
  export interface Theme {
    borderRadius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
  export interface TypographyVariants {
    secondaryFont: string;
    description: CSSProperties;
    roundWrapperCardTitle: CSSProperties;
    roundWrapperCardDesc: CSSProperties;
    upcomingCardTimer: CSSProperties;
    poweredBy: CSSProperties;
    tabsOnProjectsPage: CSSProperties;
    mainBanner: CSSProperties;
    secondaryBanner: CSSProperties;
    body3: CSSProperties;
    teamUserTitle: CSSProperties;
    textLowFooter: CSSProperties;
  }

  export interface TypographyVariantsOptions {
    secondaryFont?: string;
    description?: CSSProperties;
    roundWrapperCardTitle?: CSSProperties;
    roundWrapperCardDesc?: CSSProperties;
    upcomingCardTimer?: CSSProperties;
    poweredBy?: CSSProperties;
    tabsOnProjectsPage?: CSSProperties;
    mainBanner?: CSSProperties;
    secondaryBanner?: CSSProperties;
    body3?: CSSProperties;
    teamUserTitle?: CSSProperties;
    statusCard?: CSSProperties;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Palette extends CustomPalette {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface PaletteOptions extends CustomPalette {}
}
