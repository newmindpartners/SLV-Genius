import { styled, Typography } from '@mui/material';

export const SubtleDescription = styled(Typography)(() => ({
  color: '#B9CAED',
  fontFamily: ['Mulish', 'sans-serif'].join(','),
  fontStyle: 'normal',
  fontWeight: 300,
  fontSize: '14px',
  lineHeight: '28px',
}));

export const Description = styled(Typography)(() => ({
  fontFamily: ['Mulish', 'sans-serif'].join(','),
  fontWeight: 300,
  fontSize: '14px',
  lineHeight: '28px',
}));
