import { styled } from '@mui/material';

import GreenGradientButton from './GreenGradientButton';

const NeutralButton = styled(GreenGradientButton)({
  background: '#212137 !important',
  boxShadow: 'none !important',

  '& span': {
    color: '#FFFFFF',
  },

  '&:hover': {
    background: '#212137 !important',
    boxShadow: 'none !important',
  },
});

export default NeutralButton;
