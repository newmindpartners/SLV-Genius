import { Grid, SxProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, ReactElement } from 'react';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';

export type BannerProps = {
  title: string;
  buttonLabel: string;

  img?: string;
  background?: string;
  isCentered?: boolean;
  isTextMediumSized?: boolean;
  isConnectButtonMediumSized?: boolean;
  hasHighlights?: boolean;

  Features?: () => JSX.Element;
  // added for better SEO indexation
  id?: string;
  sx?: SxProps;
};

const Banner: FC<BannerProps> = ({
  title,
  buttonLabel,

  img,
  background,
  isCentered,
  isTextMediumSized,
  isConnectButtonMediumSized,
  hasHighlights,

  Features,

  id,
  sx,
}): ReactElement => (
  <Wrapper
    container
    background={background}
    direction={{ xs: 'column', sm: 'row' }}
    position={'relative'}
    zIndex={1}
    sx={sx}
  >
    {img && <img src={img} alt="rocket" />}

    <Grid
      container
      spacing={{ xs: 3, sm: 4, md: 9.375 }}
      flexWrap="nowrap"
      direction="column"
      alignItems={
        isCentered ? { xs: 'center', sm: 'center' } : { xs: 'center', sm: 'flex-start' }
      }
    >
      {hasHighlights && (
        <>
          <PurpleHighlightContainer>
            <img
              src={'/images/earnIllustrations/PurpleHighlight.png'}
              alt={'PurpleHighlight'}
            />
          </PurpleHighlightContainer>
          <GreenHighlightContainer>
            <img
              src={'/images/earnIllustrations/GreenHighlight.png'}
              alt={'GreenHighlight'}
            />
          </GreenHighlightContainer>
        </>
      )}

      <Grid item xs={12}>
        <Title
          variant="mainBanner"
          color="textColor.main"
          fontSize={
            isTextMediumSized ? { xs: '28px', md: '44px' } : { xs: '28px', md: '60px' }
          }
          lineHeight={
            isTextMediumSized ? { xs: '40px', md: '56px' } : { xs: '40px', md: '75px' }
          }
          fontWeight={900}
          isCentered={isCentered}
        >
          {title}
        </Title>
      </Grid>
      <WrapperButton item xs={12}>
        <ConnectWalletButtonDialog
          label={buttonLabel}
          size={isConnectButtonMediumSized ? 'medium' : 'large'}
          showWalletAddressIfConnected={false}
          id={id}
        />
      </WrapperButton>
    </Grid>

    {Features && <Features />}
  </Wrapper>
);

const Wrapper = styled(Grid)<{ background: string | undefined }>(
  ({ theme, background }) => ({
    borderRadius: theme.borderRadius.lg,
    background: background
      ? `url(${background}) no-repeat right`
      : theme.palette.bgColor.main,
    backgroundSize: 'cover',
    padding: '90px 115px 90px',
    zIndex: '1',

    '& img': {
      position: 'absolute',
      height: '430px',
      right: '100px',
      top: '60px',

      [theme.breakpoints.down('lg')]: {
        top: '65px',
        right: '20px',
        height: '450px',
      },
      [theme.breakpoints.down('md')]: {
        top: '150px',
        right: '5px',
        height: '300px',
        transform: 'rotate(360deg)',
      },
      [theme.breakpoints.down('sm')]: {
        top: '190px',
        right: '40px',
        height: '320px',
        transform: 'rotate(340deg)',
      },
    },

    [theme.breakpoints.down('lg')]: {
      padding: '90px 60px',
    },

    [theme.breakpoints.down('sm')]: {
      padding: '42px 49px 260px',
    },
  }),
);

const Title = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCentered',
})<{ isCentered: boolean | undefined }>(({ isCentered, theme }) => ({
  display: 'block',
  maxWidth: '550px',

  [theme.breakpoints.up('xs')]: {
    maxWidth: '550px',
    width: '100%',
    textAlign: 'center',
  },

  [theme.breakpoints.up('sm')]: {
    maxWidth: '400px',
    textAlign: isCentered ? 'center' : 'left',
  },

  [theme.breakpoints.up('md')]: {
    maxWidth: '550px',
  },

  [theme.breakpoints.down('md')]: {
    fontSize: '23px',
  },
}));

const WrapperButton = styled(Grid)(({ theme }) => ({
  '& button': {
    display: 'block',

    [theme.breakpoints.down('sm')]: {
      padding: '15px 20px',
    },
  },
}));

const PurpleHighlightContainer = styled(Grid)(({ theme }) => ({
  '& img': {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 'fit-content',
    width: 'fit-content',
    borderTopLeftRadius: theme.borderRadius.lg,
  },

  [theme.breakpoints.down('sm')]: {
    '& > img': {
      transform: 'none',
    },
  },
}));

const GreenHighlightContainer = styled(PurpleHighlightContainer)(({ theme }) => ({
  '& img': {
    top: 'inherit',
    left: 'inherit',
    bottom: 0,
    right: 0,
    borderBottomRightRadius: theme.borderRadius.lg,
    borderTopLeftRadius: 'inherit',
  },
}));

export default Banner;
