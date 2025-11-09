import { Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';

type SubtitleProps = {
  subtitle: string;

  extraInformation?: string;
  tooltipContent?: string;
};

const Subtitle: FC<SubtitleProps> = ({
  subtitle,

  extraInformation,
  tooltipContent,
}) => {
  return (
    <Grid display="flex" justifyContent="space-between" width="100%">
      <Grid display="flex" gap="3px" alignItems="center">
        <Typography
          variant="tabsOnProjectsPage"
          align="left"
          color="textColor"
          fontWeight="500"
          lineHeight="20px"
        >
          {subtitle}:
        </Typography>

        {tooltipContent && (
          <Tooltip title={tooltipContent} placement="right">
            <Grid height="16px">
              <InfoIcon />
            </Grid>
          </Tooltip>
        )}
      </Grid>

      {extraInformation && (
        <Typography
          variant="body3"
          align="right"
          color="gray.light"
          fontSize="13px"
          lineHeight="20px"
        >
          {`Recommended: ${extraInformation}`}
        </Typography>
      )}
    </Grid>
  );
};

export default Subtitle;
