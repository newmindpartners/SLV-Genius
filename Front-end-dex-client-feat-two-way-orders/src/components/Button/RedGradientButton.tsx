import { styled } from '@mui/material';

import GreenGradientButton from './GreenGradientButton';

const RedGradientButton = styled(GreenGradientButton)(() => ({
  background: 'linear-gradient(90deg, #FF4A4C 0%, #FF4A8B 100%)',

  '& span': {
    color: '#FFFFFF',
  },

  '&:hover': {
    boxShadow: '0px 5px 30px 0px #FF4A4C4A',
    background: 'linear-gradient(90deg, #FF4A4C 0%, #FF4A8B 100%)',
  },
}));

export default RedGradientButton;
