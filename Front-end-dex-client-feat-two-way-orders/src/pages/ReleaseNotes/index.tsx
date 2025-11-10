import { Grid, styled, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

// import markdown from '../../../release-notes/releases.md';

const ReleaseNotes = (): JSX.Element => {
  const markdownComponents = {
    h1: ({ ...props }) => (
      <Title variant="h4" fontWeight="600" marginTop="40px" {...props} />
    ),
    h2: ({ ...props }) => (
      <Typography
        variant="body3"
        marginTop="10px"
        marginBottom="5px"
        fontWeight="600"
        {...props}
      />
    ),
    p: ({ ...props }) => (
      <Typography variant="statusCard" marginBottom="10px" fontWeight="500" {...props} />
    ),
    ul: ({ ...props }) => (
      <Typography variant="description" fontWeight="500" {...props} />
    ),
  };

  return (
    <Grid
      display="flex"
      flexDirection="column"
      maxWidth="1000px"
      margin="0 auto"
      gap="40px"
    >
      <Typography variant="h2">Release Notes</Typography>

      <Container container flexWrap={'nowrap'} direction={'column'}>
        {/* <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown> */}
      </Container>
    </Grid>
  );
};

const Container = styled(Grid)(({ theme }) => ({
  background: theme.palette.bgCardRoundColor.main,
  borderRadius: theme.borderRadius.lg,
  padding: '30px 50px',
  margin: '0 auto',
}));

const Title = styled(Typography)({
  ':first-of-type': {
    marginTop: 0,
  },
});

export default ReleaseNotes;
