import { Grid } from '@mui/material';
import { FC, ReactElement, ReactNode } from 'react';
import NotificationBanner from '~/components/NotificationBanner/NotificationBanner';

type ComingSoonDataProps = {
  title: string;
  description: string;
  image: ReactNode;
};

const ComingSoon: FC<ComingSoonDataProps> = ({
  title,
  description,
  image,
}): ReactElement => (
  <Grid container rowSpacing={6.25} direction="column" pb="20px">
    <Grid
      container
      item
      mt={5}
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Grid container maxWidth="800px" width="90%" mb="20px">
        <NotificationBanner title={title} text={description} hasHighlights={true} />
      </Grid>

      <Grid container justifyContent="center">
        {image}
      </Grid>
    </Grid>
  </Grid>
);

export default ComingSoon;
