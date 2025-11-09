import { GlobalStyles } from '@mui/material';

export const OptionsGlobalStyles = () => (
  <GlobalStyles
    styles={{
      '*::-webkit-scrollbar': {
        height: '4px',
        width: '4px',
        background: 'transparent',
      },
      '*::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '*::-webkit-scrollbar-thumb': {
        background: '#4E5979',
        borderRadius: '20px',
      },
    }}
  />
);
