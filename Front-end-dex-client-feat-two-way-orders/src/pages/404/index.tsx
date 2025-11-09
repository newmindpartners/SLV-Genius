import { Grid, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '~/components/Button/Button';
import { Icon404 } from '~/components/Icons/Icon404';

const Page404 = () => {
  return (
    <Container position="relative">
      <RadialGradient />
      <ContentWrapper container>
        <Grid>
          <Icon404 />
          <Button color="primary" className="bottomButton">
            Back to Home
          </Button>
        </Grid>
        <TextBlock container>
          <Grid container direction="column">
            <Typography component="h2" color="textColor.main">
              That’s an error.
            </Typography>
            <Typography component="h3" color="textColor.main">
              Here will be the error text.
              <br />
              The requested URL /badpage was not found on this server..
            </Typography>
            <Button color="primary">Back to Home</Button>
          </Grid>
        </TextBlock>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled(Grid)(({ theme }) => ({
  margin: '48px 0 206px',
  '.bottomButton': {
    display: 'none',
  },
  '@media(max-width: 600px)': {
    margin: '48px 0 150px',
    '.bottomButton': {
      display: 'block',
      width: '100%',
      marginTop: '103px',
      color: theme.palette.bgPrimaryGradient.contrastText,
      fontSize: '16px',
      lineHeight: '22px',
      fontWeight: 800,
      padding: '16px 34px',
    },
  },
}));
const ContentWrapper = styled(Grid)({
  alignItems: 'flex-end',
  gap: '69px',
  svg: {
    marginLeft: '40px',
    marginBottom: '70px',
  },
  '@media(max-width: 1300px)': {
    gap: 0,
    flexDirection: 'column-reverse',
    alignItems: 'center',
    svg: {
      width: '800px',
      margin: '0 auto',
    },
  },
  '@media(max-width: 1000px)': {
    alignItems: 'center',
    alignContent: 'center',
    svg: {
      height: 'auto',
      maxWidth: '545px',
      margin: '0 auto',
    },
  },
  '@media(max-width: 600px)': {
    gap: '83px',
    svg: {
      width: '100%',
    },
  },
});

const TextBlock = styled(Grid)(({ theme }) => ({
  width: 'fit-content',
  '& > div': {
    gap: '30px',
    maxWidth: '290px',
    h2: {
      fontSize: '36px',
      fontWeight: 800,
      lineHeight: '45px',
    },
    h3: {
      fontSize: '16px',
      fontWeight: 300,
      lineHeight: '28px',
    },
    button: {
      padding: '22px 34px',
      marginTop: '5px',
      color: theme.palette.bgPrimaryGradient.contrastText,
      fontSize: '16px',
      lineHeight: '22px',
      fontWeight: 800,
      width: 'fit-content',
    },
  },
  '@media(max-width: 1300px)': {
    width: '100%',
    marginLeft: '81px',
  },
  '@media(max-width: 1000px)': {
    '& > div': {
      gap: '20px',
      maxWidth: '260px',
      h2: {
        fontSize: '28px',
        lineHeight: '35px',
      },
      h3: {
        lineHeight: '26px',
      },
      button: {
        padding: '16px 34px',
        marginTop: '10px',
      },
    },
  },
  '@media(max-width: 600px)': {
    margin: 0,
    '& > div': {
      button: {
        display: 'none',
      },
    },
  },
}));

const RadialGradient = styled(Grid)({
  top: '-480px',
  left: '-900px',
  position: 'absolute',
  width: '1273px',
  height: '1273px',
  background:
    'radial-gradient(50% 50% at 50% 50%, #406395 0%, rgba(43, 64, 119, 0.35) 51.65%, rgba(5, 8, 16, 0) 100%)',
  '@media(max-width: 600px)': {
    top: '100px',
    left: '330px',
    height: '973px',
    width: '973px',
  },
});

export default Page404;
