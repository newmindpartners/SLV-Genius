import { styled, Typography } from '@mui/material';

export const SubtleDescription = styled(Typography)(() => ({
  color: '#B9CAED',
  fontFamily: ['Mulish', 'sans-serif'].join(','),
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '24px',
}));

export const Description = styled(Typography)(() => ({
  fontFamily: ['Mulish', 'sans-serif'].join(','),
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '18px',
  textAlign: 'right',
}));
