import { Grid, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { FC, ReactElement } from 'react';

interface Copyright {
  title: string;
  rightsReserved: string;
}

export interface Props {
  slogan: string;
  copyright: Copyright;
  redirects: ReactElement[];
  policies?: ReactElement[];
  socials: ReactElement[];
  logo: ReactElement;
}

const Footer: FC<Props> = ({ logo, slogan, socials, copyright, redirects, policies }) => (
  <FooterWrapper>
    <Container>
      <FooterContent container pt={8}>
        <FooterTop container item justifyContent="space-between" wrap="wrap">
          <Col>
            {logo}
            <Slogan variant="description">{slogan}</Slogan>
          </Col>
          <Col>
            <IconsList>{socials}</IconsList>
          </Col>
          <Col>
            <LinksList>{redirects}</LinksList>
            {policies && <LinksList>{policies}</LinksList>}
          </Col>
        </FooterTop>
        <LowerFooter
          container
          item
          justifyContent="space-between"
          alignItems="flex-end"
          wrap="wrap"
        >
          <Col>
            <CopyrightItem variant="description">{copyright.title}</CopyrightItem>
          </Col>
          <Col>
            <CopyrightItem variant="description">
              {copyright.rightsReserved}
            </CopyrightItem>
          </Col>
        </LowerFooter>
      </FooterContent>
    </Container>
  </FooterWrapper>
);

const FooterWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.bgColor.main,
  paddingBottom: '30px',
}));

const FooterContent = styled(Grid)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.lines.main}`,
}));

const FooterTop = styled(Grid)(({ theme }) => ({
  gap: 20,

  [theme.breakpoints.down(1100)]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const Col = styled('div')(({ theme }) => ({
  [theme.breakpoints.down(1100)]: {
    textAlign: 'center',
  },
  '&:nth-of-type(2)': {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const IconsList = styled('div')({
  '& a': {
    margin: '0 7px',
  },
});

const Slogan = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.palette.textColorDescription.main,
  maxWidth: '325px',
  paddingRight: '55px',
  lineHeight: '27px',
  marginTop: '25px',

  [theme.breakpoints.down(1100)]: {
    paddingRight: 0,
  },
}));

const LinksList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  [theme.breakpoints.down(1100)]: {
    justifyContent: 'center',
  },

  '& a': {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary.main,
    cursor: 'pointer',
    borderRight: 'none',
    textDecoration: 'none',
    paddingLeft: 25,
    '&:first-of-type': {
      paddingLeft: 0,
    },
    '&:last-child': {
      [theme.breakpoints.down(483)]: {
        marginTop: 10,
        paddingLeft: 0,
      },
    },
    '& svg': {
      fill: theme.palette.textColor.main,
    },
    '& span': {
      marginRight: 5,
      fontWeight: 400,
    },
  },
}));

const LowerFooter = styled(Grid)(({ theme }) => ({
  marginTop: '55px',
  gap: 20,

  [theme.breakpoints.down(1000)]: {
    alignItems: 'center',
  },
  [theme.breakpoints.down(711)]: {
    justifyContent: 'center',
    marginTop: '35px',
  },
}));

const CopyrightItem = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.palette.textLowFooter.main,
  maxWidth: '325px',
  alignSelf: 'flex-end',
  [theme.breakpoints.down(711)]: {
    margin: '0 auto',
  },
}));

export default Footer;
