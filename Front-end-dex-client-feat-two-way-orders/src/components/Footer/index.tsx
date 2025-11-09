import { Grid, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FC, Fragment, ReactElement, useEffect, useState } from 'react';
import {
  FooterLinksBlockProps,
  FooterLinksColumnProps,
  FooterProps,
  FooterSocialsBlockProps,
} from '~/components/Footer/types';
import { LOCAL_STORAGE_KEYS } from '~/utils/constants';

import Button from '../Button/Button';
import TermsOfUse from './TermsOfUse';

const Footer: FC<FooterProps> = ({
  logo,
  slogan,
  rightsReserved,
  copyright,
  redirects,
  socials,
  links,
  footerLegalLinks,
  footerQuickLinks,
}): ReactElement => {
  const [showTermsOfUse, setShowTermsOfUse] = useState(true);

  useEffect(() => {
    const bannerDismissed =
      localStorage.getItem(LOCAL_STORAGE_KEYS.TERMS_OF_USE_BANNER_DISMISSED) === 'true';
    setShowTermsOfUse(!bannerDismissed);
  }, []);

  const handleHideTermsOfUse = () => {
    setShowTermsOfUse(false);
    localStorage.setItem(LOCAL_STORAGE_KEYS.TERMS_OF_USE_BANNER_DISMISSED, 'true');
  };

  return (
    <Grid
      container
      padding={{ xs: '45px 30px', xl: '45px 0' }}
      pt="40px"
      pb="45px"
      borderTop="1px solid #7787B1"
    >
      {showTermsOfUse && <TermsOfUse handleHideTermsOfUse={handleHideTermsOfUse} />}

      <Grid
        container
        gap={{ md: '100px', lg: '160px' }}
        justifyContent="space-between"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        wrap="nowrap"
        direction={{ xs: 'column', md: 'row' }}
      >
        <LogoSocialsBlock
          slogan={slogan}
          logo={logo}
          socials={socials}
          copyright={copyright}
        />
        <LinksBlock
          links={links}
          footerQuickLinks={footerQuickLinks}
          footerLegalLinks={footerLegalLinks}
          redirects={redirects}
          rightsReserved={rightsReserved}
        />
      </Grid>
    </Grid>
  );
};

const LogoSocialsBlock: FC<FooterSocialsBlockProps> = ({
  logo,
  socials,
  copyright,
  slogan,
}): ReactElement => (
  <Grid
    container
    alignItems={{ xs: 'center', md: 'flex-start' }}
    justifyContent="center"
    gap={{ md: '30px', lg: '70px' }}
    maxWidth={{ sx: '100%', md: '180px', lg: '400px' }}
  >
    <LogoWrapper
      alignItems={{ xs: 'center', md: 'flex-start' }}
      container
      gap="3px"
      direction="column"
    >
      {logo}
      <Typography
        fontSize="15px"
        fontWeight="500"
        lineHeight="28px"
        color="#C1CEF1"
        mt="20px"
      >
        {slogan}
      </Typography>
    </LogoWrapper>
    <Grid
      container
      gap="7px"
      alignItems={{ xs: 'center', md: 'flex-start' }}
      direction={{ xs: 'column', md: 'row' }}
    >
      <Typography fontSize="14px" fontWeight="500" lineHeight="33px" color="#C1CEF1">
        Genius Community:
      </Typography>
      <Grid container gap="14px" width="fit-content">
        {socials.map((item, i) => (
          <Fragment key={i}>{item}</Fragment>
        ))}
      </Grid>
    </Grid>
    <Typography
      display="block"
      width={{ xs: '300px', md: 'auto' }}
      mt={{ xs: '15px', md: 0 }}
      textAlign={{ xs: 'center', md: 'left' }}
      fontSize="14px"
      fontWeight="500"
      lineHeight="26px"
      color="#C1CEF1"
    >
      {copyright}
    </Typography>
  </Grid>
);

const LogoWrapper = styled(Grid)(({ theme }) => ({
  svg: {
    [theme.breakpoints.down('lg')]: {
      width: '200px',
    },
  },
}));

const LinksBlock: FC<FooterLinksBlockProps> = ({
  links,
  footerQuickLinks,
  footerLegalLinks,
  redirects,
  rightsReserved,
}): ReactElement => (
  <Grid
    container
    direction="column"
    width="fit-content"
    maxWidth="900px"
    justifyContent="space-between"
    height="100%"
    mt={{ xs: '10px', md: 0 }}
    gap={{ md: '30px', lg: '100px' }}
  >
    <Grid
      container
      alignItems={{ xs: 'center', md: 'flex-start' }}
      gap={{ md: '50px', lg: '137px' }}
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
    >
      <Grid
        container
        gap={{ xs: '0', md: '60px' }}
        width="fit-content"
        justifyContent="space-between"
        item
        xs={12}
        alignItems={{ xs: 'center', md: 'flex-start' }}
        direction={{ xs: 'column', md: 'row' }}
      >
        <FooterLinksColumn title="Links" values={links} />
        <FooterLinksColumn title="Quick Links" values={footerQuickLinks} />
        <FooterLinksColumn title="Legal" values={footerLegalLinks} />
      </Grid>
    </Grid>
    <Grid
      container
      justifyContent={{ xs: 'center', md: 'space-between' }}
      mt={{ xs: '35px', md: '0' }}
      mr={{ xs: '0', md: '35px' }}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'center', md: 'center' }}
    >
      <Grid
        container
        gap={{ xs: '10px', md: '25px' }}
        width={{ xs: '90%', md: 'fit-content' }}
        marginBottom={{ xs: '15px', md: 0 }}
        justifyContent={{ xs: 'center', md: 'space-between' }}
      >
        {redirects.map((item, i) => (
          <RedirectLink key={i}>{item}</RedirectLink>
        ))}
      </Grid>
      <Typography fontSize="14px" fontWeight="500" lineHeight="30px" color="#C1CEF1">
        {rightsReserved}
      </Typography>
    </Grid>
  </Grid>
);

const FooterLinksColumn: FC<FooterLinksColumnProps> = ({
  title,
  values,
  button,
}): ReactElement => (
  <Grid
    container
    mt={{ xs: '25px', md: 0 }}
    gap={{ xs: '15px', md: '25px' }}
    alignItems={{ xs: 'center', md: 'flex-start' }}
    direction="column"
    width="fit-content"
  >
    <Typography fontSize="19px" fontWeight="700" lineHeight="30px" color="white">
      {title}
    </Typography>
    {button ? (
      <Button>WhitePaper</Button>
    ) : (
      <Grid
        container
        direction="column"
        gap="8px"
        alignItems={{ xs: 'center', md: 'flex-start' }}
      >
        {values?.map((item, i) => (
          <MenuLink key={i}>{item}</MenuLink>
        ))}
      </Grid>
    )}
  </Grid>
);
const MenuLink = styled(Grid)({
  h6: {
    color: '#C1CEF1',
    fontSize: '14px',
    lineHeight: '30px',
  },
  a: {
    color: '#C1CEF1',
    li: {
      padding: 0,
    },
    span: {
      color: '#C1CEF1',
      fontSize: '14px',
      lineHeight: '30px',
    },
  },
});

const RedirectLink = styled(Grid)(({ theme }) => ({
  a: {
    color: theme.palette.primary.dark,
    display: 'flex',
    width: 'fit-content',
    gap: '9px',
  },
}));

export default Footer;
