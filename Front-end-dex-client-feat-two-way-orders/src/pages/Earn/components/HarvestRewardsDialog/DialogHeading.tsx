import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, ReactElement } from 'react';
import { PopupCloseSvg } from '~/components/Icons/PopupCloseSvg';

type HeadingDialogProps = {
  title?: string;
  onClose: () => void;
};

const DialogHeading: FC<HeadingDialogProps> = ({
  title = 'Harvest Rewards',
  onClose,
}): ReactElement => (
  <Grid mb={{ xs: '40px', sm: '28px' }}>
    <Grid container justifyContent={'flex-end'}>
      <CloseButton item onClick={onClose}>
        <PopupCloseSvg />
      </CloseButton>
    </Grid>
    <Grid
      justifyContent="center"
      container
      alignItems="center"
      gap={{ xs: '79px', sm: '44px' }}
      direction="column"
    >
      <Typography
        fontWeight={800}
        fontSize={{ xs: '20px', sm: '24px' }}
        lineHeight={{ xs: '28px', sm: '32px' }}
        color="#FFF"
      >
        {title}
      </Typography>
    </Grid>
  </Grid>
);

const CloseButton = styled(Grid)(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  right: '30px',
  top: '30px',
  [theme.breakpoints.down('sm')]: {
    right: '24px',
    top: '28px',
  },
}));

export default DialogHeading;
