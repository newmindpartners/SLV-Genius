import { Grid, Popover, PopoverOrigin, styled, Typography } from '@mui/material';
import { isNull } from 'lodash';
import { FC } from 'react';
import { secondsToDays } from '~/utils/nftUtils';

type StakingNFTRemainingDaysPopoverProps = {
  assetId: string;

  remainingTime: number | null | undefined;
  anchorEl: HTMLElement | null;

  handleClose: () => void;
};

const anchorOrigin: PopoverOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
};

const transformOrigin: PopoverOrigin = {
  vertical: 'top',
  horizontal: 'center',
};

const StakingNFTRemainingDaysPopover: FC<StakingNFTRemainingDaysPopoverProps> = ({
  assetId,
  remainingTime,
  anchorEl,
  handleClose,
}) => {
  const truncatedAssetId =
    assetId.length < 8 ? assetId : `${assetId.slice(0, 8)}...${assetId.slice(-8)}`;

  const failedToFind = isNull(remainingTime);

  const validContent = (
    <>
      <Typography
        variant="tabsOnProjectsPage"
        fontWeight="500"
        lineHeight="16px"
        display="flex"
        justifyContent="center"
      >
        {truncatedAssetId}
      </Typography>
      <HorizontalGreyLine />
      <Grid display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="statusCard" fontWeight="500">
          Time Left:
        </Typography>
        <Typography
          variant="teamUserTitle"
          fontSize="19px"
          fontWeight="700"
          lineHeight="24px"
        >
          {remainingTime === 0 || remainingTime
            ? Math.floor(secondsToDays(remainingTime))
            : 'N/A'}{' '}
          Days
        </Typography>
      </Grid>
    </>
  );

  const invalidContent = (
    <Typography
      variant="tabsOnProjectsPage"
      fontWeight="500"
      lineHeight="16px"
      display="flex"
      justifyContent="center"
    >
      The requested NFT asset was not found
    </Typography>
  );

  return (
    <PopoverWrapper
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      {failedToFind ? invalidContent : validContent}
    </PopoverWrapper>
  );
};

const PopoverWrapper = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    marginTop: '15px',
    padding: '20px',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.palette.bgPrimaryGradient.contrastText,
    minWidth: '230px',
  },
}));

const HorizontalGreyLine = styled(Grid)(() => ({
  height: '1px',
  background: '#555b71',
  margin: '15px auto',
  width: '100%',
  alignSelf: 'center',
}));

export default StakingNFTRemainingDaysPopover;
