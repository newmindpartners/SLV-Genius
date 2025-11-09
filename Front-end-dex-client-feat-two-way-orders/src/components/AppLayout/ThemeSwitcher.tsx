import { PropsOf } from '@emotion/react';
import { styled } from '@mui/material';
import { FC } from 'react';
import { ThemeSwitcher } from '~/components/ThemeToggleProvider/ThemeSwitcher';

const Wrapper = styled('div')(() => ({
  position: 'absolute',
  right: 10,
  top: 105,
}));

type ThemeSwitcherProps = PropsOf<typeof ThemeSwitcher>;

const ThemeToggleSwitcher: FC<ThemeSwitcherProps> = (props) => {
  return (
    <Wrapper>
      <ThemeSwitcher {...props} />
    </Wrapper>
  );
};

export default ThemeToggleSwitcher;
