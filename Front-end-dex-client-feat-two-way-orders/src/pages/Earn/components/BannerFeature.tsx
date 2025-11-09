import { Grid, styled, Typography } from '@mui/material';
import { FC, memo } from 'react';

type BannerFeatureProps = {
  title: string;
  illustration: string;
};

const BannerFeature: FC<BannerFeatureProps> = ({ title, illustration }) => (
  <BorderWrapper>
    <Wrapper
      display="flex"
      flexDirection="column"
      justifyContent="center"
      padding="20px"
      width="350px"
    >
      <StyledTypography variant="h4">{title}</StyledTypography>

      <Grid display="flex" width="100%" height="100%">
        <img src={`/images/earnIllustrations/${illustration}.png`} alt={illustration} />
      </Grid>
    </Wrapper>
  </BorderWrapper>
);

const BorderWrapper = styled(Grid)(({ theme }) => ({
  padding: '1px',
  backgroundImage:
    'linear-gradient(#000, #000), linear-gradient(133deg, rgba(90,186,255,1) 25%, rgba(69,24,196,1) 50%, rgba(15,23,40,1) 100%)',
  backgroundClip: 'content-box, padding-box',
  borderRadius: theme.borderRadius.lg,
}));

const Wrapper = styled(Grid)(({ theme }) => ({
  background:
    'linear-gradient(109.47deg, rgba(90, 186, 255, 0.076) -12.85%, rgba(69, 24, 196, 0.11) 19.69%, rgba(15, 23, 40, 0.126) 109.57%), rgba(32, 39, 64, 0.2)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.borderRadius.lg,

  '& img': {
    position: 'static',
    width: 'auto',
    height: '180px',
    margin: '0 auto',
  },

  [theme.breakpoints.down('sm')]: {
    paddingBottom: '0px',

    '& img': {
      // to prevent images from rotating
      transform: 'none',
      maxWidth: '100%',
      height: 'auto',
    },
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: '800',
  textAlign: 'center',
  maxWidth: '200px',
  height: '65px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    height: 'auto',
  },
}));

export default memo(BannerFeature);
