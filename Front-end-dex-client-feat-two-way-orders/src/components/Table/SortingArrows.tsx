import { Grid } from '@mui/material';
import { useTheme } from '@mui/material';
import { FC } from 'react';

import DownArrowTableHeaderSVG from '../Icons/DownArrowTableHeaderSVG';
import UpArrowTableHeaderSVG from '../Icons/UpArrowTableHeaderSVG copy';

const determineColor = (
  direction: 'asc' | 'desc',
  currentDirection: 'asc' | 'desc',
  isSelected: boolean,
  activeColor: string,
  inactiveColor: string,
) => (isSelected && direction === currentDirection ? activeColor : inactiveColor);

type SortingArrowsProps = {
  isSelected: boolean;
  direction: 'asc' | 'desc';
};

const SortingArrows: FC<SortingArrowsProps> = ({ isSelected, direction }) => {
  const theme = useTheme();
  const ACTIVE_COLOR = theme.palette.primary.main;
  const INACTIVE_COLOR = theme.palette.social.main;

  return (
    <Grid
      display="flex"
      flexDirection="column"
      gap="2px"
      marginTop="1px"
      marginLeft="5px"
    >
      <UpArrowTableHeaderSVG
        color={determineColor('asc', direction, isSelected, ACTIVE_COLOR, INACTIVE_COLOR)}
      />
      <DownArrowTableHeaderSVG
        color={determineColor(
          'desc',
          direction,
          isSelected,
          ACTIVE_COLOR,
          INACTIVE_COLOR,
        )}
      />
    </Grid>
  );
};

export default SortingArrows;
