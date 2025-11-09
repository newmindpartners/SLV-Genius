import { PaletteMode } from '@mui/material';
import { Theme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

export * from './ThemeSwitcher';

export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
const THEME_DEFAULT = THEME_DARK;
const LOCAL_STORAGE_KEY_THEME_TYPE = 'THEME_TYPE';
type ThemeType = typeof THEME_DARK | typeof THEME_LIGHT;

export const toggleThemeType = (): void => {
  localStorage.setItem(
    LOCAL_STORAGE_KEY_THEME_TYPE,
    localStorage.getItem(LOCAL_STORAGE_KEY_THEME_TYPE) === THEME_LIGHT
      ? THEME_DARK
      : THEME_LIGHT,
  );

  window.location.reload();
};

export const getThemeType = (): ThemeType => {
  const storageType = localStorage.getItem(LOCAL_STORAGE_KEY_THEME_TYPE);

  switch (storageType) {
    case THEME_DARK:
      return THEME_DARK;
    case THEME_LIGHT:
      return THEME_LIGHT;
    default:
      return THEME_DEFAULT;
  }
};

type Props = {
  children: React.ReactNode;
  createThemeWithMode: (mode: PaletteMode) => Theme;
};

const ThemeToggleProvider: React.FC<Props> = ({ children, createThemeWithMode }) => {
  const themeType = getThemeType();
  const theme = createThemeWithMode(themeType);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export { ThemeToggleProvider as default };
