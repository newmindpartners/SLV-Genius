import { Theme } from '@mui/material';

export const getRoiColor = (theme: Theme, roiPercent: number): string => {
  if (roiPercent === 0) {
    return theme.palette.common.white;
  } else if (roiPercent > 0) {
    return theme.palette.success.main;
  } else {
    return theme.palette.error.main;
  }
};

export const proportionalToPercent = (proportional: number): number => proportional * 100;
