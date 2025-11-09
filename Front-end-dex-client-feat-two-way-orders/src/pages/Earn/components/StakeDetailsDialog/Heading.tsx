import { Grid, styled, Typography } from '@mui/material';
import Avatar from '~/components/Avatar/Avatar';

type HeadingProps = {
  name: string;
  imageUrl: string;
};

const Heading = ({ name, imageUrl }: HeadingProps) => (
  <Grid item container direction="column" alignItems="center" rowSpacing={1}>
    <Grid item margin={0.5}>
      {imageUrl && <HeadingAvatar src={imageUrl} size="small" variant="circle" />}
    </Grid>
    <Grid item>
      <Typography variant="h4">{name}</Typography>
    </Grid>
  </Grid>
);

const HeadingAvatar = styled(Avatar)(({ theme }) => ({
  height: '82px',
  width: '82px',
  boxSizing: 'content-box',
  borderRadius: '0%',

  [theme.breakpoints.down('xl')]: {
    width: '66px',
    height: '66px',
  },

  [theme.breakpoints.down('lg')]: {
    width: '56px',
    height: '56px',
  },
}));

export default Heading;
