import { Grid, Link, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FC, ReactElement, useState } from 'react';

import Button from '../Button/Button';
import TermsAndConditionsDialog from '../Dialogs/TermsAndConditionsDialog/TermsAndConditionsDialog';
import NotificationBanner from '../NotificationBanner/NotificationBanner';

const GY_WEBSITE_LINK = 'https://www.geniusyield.co/';
const TERMS_URL = '/cdn/terms/v1.0.0-en-us.html';

const TITLE = 'TERMS OF USE';
const INITIAL_TERMS_1 =
  'This end-user agreement (the "Agreement") should be read by you (the "User") in its entirety prior to your use of Genius Yield Association’s Services or products. Be aware that this Agreement constitutes a legally binding agreement between you and Genius Yield Association (referred to herein as "Genius Yield", "us" or "we") which owns and operates the website on the Internet and the Services at ';
const INITIAL_TERMS_2 =
  '  (the "Services"). By accessing or using the site or Genius Yield Services, you agree that you have read, understood, and agree to be bound by this agreement... ';
const READ_MORE = 'Read more';
const I_AGREE = 'I agree';

type TermsTextAndButtonProps = {
  handleReadMoreDialogOpen: () => void;
  handleHideTermsOfUse: () => void;
};

const TermsTextAndButton: FC<TermsTextAndButtonProps> = ({
  handleReadMoreDialogOpen,
  handleHideTermsOfUse,
}) => (
  <Wrapper display="flex" flexDirection="row" gap="10px" alignItems="center">
    <Grid>
      <Typography variant="poweredBy" fontWeight="300" lineHeight="8px" textAlign="left">
        {INITIAL_TERMS_1}
      </Typography>

      <Link href={GY_WEBSITE_LINK} target="_blank" rel="noreferrer" underline="hover">
        <Typography
          variant="poweredBy"
          fontWeight="300"
          lineHeight="8px"
          textAlign="left"
        >
          {GY_WEBSITE_LINK}
        </Typography>
      </Link>

      <Typography variant="poweredBy" fontWeight="300" lineHeight="8px" textAlign="left">
        {INITIAL_TERMS_2}
      </Typography>

      <Button
        color="transparent"
        size="xsmall"
        onClick={handleReadMoreDialogOpen}
        disableRipple
      >
        <Typography
          variant="poweredBy"
          fontWeight="600"
          lineHeight="8px"
          textAlign="left"
        >
          {READ_MORE}
        </Typography>
      </Button>
    </Grid>

    <Grid item width="min-width">
      <ButtonWrapper onClick={handleHideTermsOfUse}>
        <Typography
          color="background.default"
          variant="roundWrapperCardDesc"
          align="center"
          fontFamily="secondaryFont"
        >
          {I_AGREE}
        </Typography>
      </ButtonWrapper>
    </Grid>
  </Wrapper>
);

const TermsContent: FC<TermsOfUseProps> = ({ handleHideTermsOfUse }) => {
  const [showReadMoreDialog, setReadMoreDialog] = useState(false);

  const handleReadMoreDialogOpen = () => setReadMoreDialog(true);
  const handleReadMoreDialogClose = () => setReadMoreDialog(false);

  return (
    <Grid container flexDirection={'column'}>
      <Typography
        variant="teamUserTitle"
        fontWeight="800"
        lineHeight="32px"
        textAlign="left"
      >
        {TITLE}
      </Typography>

      <TermsTextAndButton
        handleReadMoreDialogOpen={handleReadMoreDialogOpen}
        handleHideTermsOfUse={handleHideTermsOfUse}
      />

      {showReadMoreDialog && (
        <TermsAndConditionsDialog
          open={showReadMoreDialog}
          onClose={handleReadMoreDialogClose}
          termsUrl={TERMS_URL}
        />
      )}
    </Grid>
  );
};

type TermsOfUseProps = {
  handleHideTermsOfUse: () => void;
};

const TermsOfUse: FC<TermsOfUseProps> = ({ handleHideTermsOfUse }): ReactElement => (
  <NotificationBanner
    Content={() => <TermsContent handleHideTermsOfUse={handleHideTermsOfUse} />}
  />
);

const Wrapper = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const ButtonWrapper = styled(Button)(({ theme }) => ({
  minWidth: '95px',

  '& > .MuiTypography-root': {
    textWrap: 'nowrap',
  },

  '&:hover': {
    boxShadow: `0 0px 4px ${theme.palette.primary.main}`,
  },
}));

export default TermsOfUse;
