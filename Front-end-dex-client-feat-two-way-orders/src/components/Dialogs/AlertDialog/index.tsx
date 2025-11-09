import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';
import { PopupCloseSvg } from '~/components/Icons/Icons';

import Button from '../../Button/Button';
import { Dialog } from '../Dialog';

export enum AlertType {
  Success,
  Failure,
}

export type AlertDialogProps = {
  alertType: AlertType;
  open: boolean;
  title: string;
  description?: string;
  link?: {
    href: string;
    text: string;
  };
  onClose: () => void;
};

const getAlertIcon = (alertType: AlertType) => {
  switch (alertType) {
    case AlertType.Success:
      return <img src="/images/dialog/success.png" alt="coin" width={'134px'} />;
    case AlertType.Failure:
      return <img src="/images/dialog/failure.png" alt="coin" width={'160px'} />;
  }
};

const getButtonText = (alertType: AlertType) => {
  switch (alertType) {
    case AlertType.Success:
      return 'Close';
    case AlertType.Failure:
      return 'Close';
  }
};

const AlertDialog: FC<AlertDialogProps> = ({
  alertType,
  title,
  description,
  link,
  onClose,
  open,
}) => {
  const dialogIcon = getAlertIcon(alertType);

  return (
    <Dialog open={open} onClose={onClose}>
      <Grid className={'heading'} container justifyContent={'flex-end'}>
        <CloserIconWrapper item className={'close'} onClick={onClose}>
          <PopupCloseSvg />
        </CloserIconWrapper>
      </Grid>
      <Grid container justifyContent="center">
        {dialogIcon}
      </Grid>
      <Typography variant="h4" color="textColor.main" align="center" mt={2} mb={3}>
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body3"
          color="buttonsInactive.main"
          align="center"
          fontFamily="secondaryFont"
          mb={3}
        >
          {description}
        </Typography>
      )}
      {link && (
        <Grid container justifyContent="center" mb={5}>
          <StyledLink href={link.href} target="_blank" onClick={onClose}>
            <Typography variant="body3">{link.text}</Typography>
            <IconWrapper>
              <ArrowForwardIcon />
            </IconWrapper>
          </StyledLink>
        </Grid>
      )}
      <Button color="gradient" onClick={onClose} size="large" fullWidth>
        <Typography
          variant="body3"
          color="bgPrimaryGradient.contrastText"
          fontWeight={600}
        >
          {getButtonText(alertType)}
        </Typography>
      </Button>
    </Dialog>
  );
};

const CloserIconWrapper = styled(Grid)({
  cursor: 'pointer',
});

const StyledLink = styled('a')(({ theme }) => ({
  background: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
  padding: '9px 18px',
  borderRadius: theme.borderRadius.lg,
  columnGap: '6px',
  color: theme.palette.primary.main,
}));

const IconWrapper = styled('span')({
  '& svg': {
    transform: 'rotate(-45deg)',
    width: '20px',
    height: '20px',
  },
});

export default AlertDialog;
