import { GlobalStyles } from '@mui/material';
import React from 'react';

const scrollbarStyles = {
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
};

const CustomGlobalStyles = () => <GlobalStyles styles={scrollbarStyles} />;

export default CustomGlobalStyles;
