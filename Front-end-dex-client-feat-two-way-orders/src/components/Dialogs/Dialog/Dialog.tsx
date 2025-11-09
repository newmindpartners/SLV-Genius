import { DialogProps, Dialog as MUIDialog, styled } from '@mui/material';
import { FC, ReactElement } from 'react';

export interface Props {
  open: boolean;
  onClose: () => void;
}

const Dialog: FC<Props & DialogProps> = ({
  open,
  children,
  onClose,
  ...props
}): ReactElement => (
  <DialogWrapper open={open} onClose={onClose} {...props}>
    {children}
  </DialogWrapper>
);

const DialogWrapper = styled(MUIDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxHeight: '85vh',
    width: '436px',
    padding: '26px 33px 30px',
    background: theme.palette.bgCardRoundColor.main,
    borderRadius: theme.borderRadius.lg,
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiDialog-paper': {
      width: '394px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiDialog-scrollPaper': {
      alignItems: 'flex-end',
    },
    '& .MuiDialog-paper': {
      width: '100%',
      padding: '21px 15px 33px',
      margin: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
}));

export default Dialog;
