import { Grid, styled, Typography } from '@mui/material';
import { ChangeEvent, FC, useRef, useState } from 'react';
import Button from '~/components/Button/Button';
import TextField from '~/components/TextField/TextField';
import { useLazyGetStakeVaultNftUsageReportQuery } from '~/redux/api';

import StakingNFTRemainingDaysPopover from './StakingNFTRemainingDaysPopover';

type NFTCheckerProps = {
  urlAssetId: string | undefined;
};

const NFTChecker: FC<NFTCheckerProps> = ({ urlAssetId }) => {
  const [assetId, setAssetId] = useState<string>(urlAssetId || '');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const buttonRef = useRef<HTMLDivElement | null>(null);

  const [fetchNftUsageReport, { data, isFetching }] =
    useLazyGetStakeVaultNftUsageReportQuery();

  const handleAssetIdChange = (event: ChangeEvent<HTMLInputElement>): void =>
    setAssetId(event.target.value);

  const handleButtonClick = (): void => {
    fetchNftUsageReport({ assetId });
    setIsPopoverOpen(true);
  };

  const handlePopoverClose = (): void => setIsPopoverOpen(false);

  return (
    <Wrapper
      display="flex"
      justifyContent="space-between"
      gap="35px"
      position="relative"
      top="0"
      padding="10px 20px"
      overflow="hidden"
    >
      <Highlight
        position="left"
        src={'/images/banner/LeftHighlight.png'}
        alt={'PurpleHighlight'}
      />
      <Highlight
        position="right"
        src={'/images/banner/RightHighlight.png'}
        alt={'GreenHighlight'}
      />

      <Grid display="flex" flexDirection="column" textAlign="left" zIndex="2">
        <Typography variant="teamUserTitle" fontWeight="800" lineHeight="32px">
          Check NFT&apos;s remaining utility
        </Typography>
        <Typography variant="poweredBy" lineHeight="16px">
          Copy paste assetID or display name of the Genius / Mascot NFT which you want to
          check remaining utility time
        </Typography>
        <Typography variant="poweredBy" lineHeight="16px" mt="5px">
          IMPORTANT: Genius NFTs and Mascot NFTs APY boosters can be used when staked
          until 23:59:59 UTC on December 31, 2025.
        </Typography>
      </Grid>

      <Grid display="flex" flexDirection="row" gap="5px" alignItems="center">
        <Grid ref={buttonRef}>
          <TextFieldWrapper
            size="small"
            placeholder="Enter AssetID"
            value={assetId}
            onChange={handleAssetIdChange}
          />
        </Grid>

        <ButtonWrapper size="small" onClick={handleButtonClick} disabled={isFetching}>
          Check
        </ButtonWrapper>
      </Grid>

      {isPopoverOpen && (
        <StakingNFTRemainingDaysPopover
          assetId={assetId}
          remainingTime={data?.secondsRemaining}
          anchorEl={buttonRef.current}
          handleClose={handlePopoverClose}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Grid)(({ theme }) => ({
  background: '#20273E',
  color: theme.palette.textColor.main,
  borderRadius: theme.borderRadius.sm,

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: 10,
  },
}));

const TextFieldWrapper = styled(TextField)({
  width: 200,
});

const ButtonWrapper = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: theme.borderRadius.sm,
  color: theme.palette.bgPrimaryGradient.contrastText,

  '&:hover': {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: `0 0px 4px ${theme.palette.primary.main}`,
  },
}));

type HighlightProps = {
  position: 'left' | 'right';
};

const Highlight = styled('img')<HighlightProps>(({ position }) => ({
  position: 'absolute',
  top: '50%',
  [position]: 0,
  transform: 'translateY(-50%)',
  width: '100%',
  height: '100%',
}));

export default NFTChecker;
