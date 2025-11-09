import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Button } from '@mui/material';

import { getThemeType, THEME_DARK, THEME_LIGHT, toggleThemeType } from '..';

const getThemeTypeOptions = () => ({
  [THEME_LIGHT]: {
    key: THEME_LIGHT,
    icon: <Brightness4Icon />,
  },
  [THEME_DARK]: {
    key: THEME_DARK,
    icon: <Brightness7Icon />,
  },
});

const getThemeTypeIcon = () => getThemeTypeOptions()[getThemeType()];

export const ThemeSwitcher: React.FC = () => {
  const { key: currentMode, icon } = getThemeTypeIcon();

  return (
    <Button
      style={{
        color: currentMode === THEME_DARK ? 'black' : 'white',
        backgroundColor: currentMode === THEME_DARK ? 'white' : 'black',
      }}
      onClick={toggleThemeType}
    >
      {icon}
    </Button>
  );
};
