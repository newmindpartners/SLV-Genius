import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';
import { PopupCloseSvg } from '~/components/Icons/Icons';
import { LOCAL_STORAGE_KEYS } from '~/utils/constants';

import Button from '../../Button/Button';
import { Dialog } from '../Dialog';

export type StakingUpdateDialogProps = {
  open?: boolean;
  onClose: () => void;
};

const StakingUpdateDialog: FC<StakingUpdateDialogProps> = ({ onClose, open }) => {
  const handleSubmit = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.STAKING_V2_LAUNCH_DIALOG_DISMISSED, 'true');
    onClose();
  };

  return (
    <StyledDialog open={!!open} onClose={onClose}>
      <Grid container justifyContent={'flex-end'}>
        <CloserIconWrapper item className={'close'} onClick={onClose}>
          <PopupCloseSvg />
        </CloserIconWrapper>
      </Grid>
      <Typography
        display="flex"
        justifyContent="center"
        variant="h3"
        color="textColor.main"
        mt={2}
        mb={3}
        fontSize="26px"
      >
        $GENS Staking Program Update
      </Typography>

      <Typography
        variant="body3"
        color="textColor.main"
        fontFamily="secondaryFont"
        lineHeight="32px"
        mb={3}
      >
        In May 2024, the $GENS Staking Program underwent an update. Please familiarize
        yourself with the most important changes:
        <br />
        <br />
        <Grid marginLeft={3}>
          <ul>
            <li>
              Fixed APY on $GENS was replaced with Rewards Multiplier on DEX fees rewards
            </li>
            <li>The “Flex Staking” option is now available</li>
            <li>An additional 1.5M $GENS was added to the program</li>
            <li>
              Rewards from Vault Staking are now claimable weekly under ”My Rewards”
            </li>
          </ul>
        </Grid>
        <br />
        Genius and Mascot NFTs utilities remain unchanged. NFTs staking will be available
        until December 31st, 2025.
        <br />
        <br /> Read more in our{' '}
        <Link
          href="https://geniusyield.medium.com/announcing-the-new-v2-gens-staking-program-7f76ce5e3127"
          target="_blank"
        >
          blog article
        </Link>
      </Typography>
      <StyledButton color="gradient" onClick={handleSubmit}>
        <Typography
          variant="body3"
          color="bgPrimaryGradient.contrastText"
          fontWeight={700}
        >
          I understand
        </Typography>
      </StyledButton>
    </StyledDialog>
  );
};

const StyledButton = styled(Button)({
  width: 'fit-content',
  marginLeft: 'auto',
});

const StyledDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    width: '700px !important',
    maxWidth: '700px !important',
  },
});

const CloserIconWrapper = styled(Grid)({
  cursor: 'pointer',
});

const Link = styled('a')({
  color: '#fff',
  textDecoration: 'underline',
});

export default StakingUpdateDialog;
