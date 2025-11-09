import {
  DialogActions,
  DialogContent,
  DialogProps,
  styled,
  SxProps,
} from '@mui/material';
import { FC, ReactNode } from 'react';

import { Dialog, DialogTitle } from '.';

export type BlurryDialogProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
  sx?: SxProps;
  actions?: ReactNode;
};

const BlurryDialog: FC<BlurryDialogProps> = ({
  onClose,
  title,
  children,
  actions,
  sx,
}) => (
  <BlurryDialogWrapper fullWidth onClose={onClose} open={true} sx={sx}>
    {title && <DialogTitle title={title} onClose={onClose} />}
    <DialogContent>{children}</DialogContent>

    {actions && <DialogActions>{actions}</DialogActions>}
  </BlurryDialogWrapper>
);

const BlurryDialogWrapper = styled(Dialog)<DialogProps>(({ theme }) => ({
  backdropFilter: 'blur(5px)',

  '& > .MuiDialog-container': {
    '& > .MuiPaper-root': {
      position: 'relative',
      backgroundColor: '#202740',
      borderRadius: theme.borderRadius.lg,
      width: 'fit-content',
      maxWidth: '538px',
      padding: '20px',

      '& > .MuiDialogTitle-root': {
        paddingBottom: 0,
        marginRight: '5px',
      },
    },
  },

  [theme.breakpoints.down('md')]: {
    '& > .MuiDialog-container': {
      alignItems: 'center',

      '& > .MuiPaper-root': {
        padding: '15px 15px',
      },
    },
  },

  [theme.breakpoints.down('sm')]: {
    '& .MuiDialog-scrollPaper': {
      alignItems: 'flex-end',
    },

    '& .MuiDialogContent-root': {
      padding: '0',
    },

    '& > .MuiDialog-container': {
      '& .MuiPaper-root': {
        width: '100%',
        maxWidth: '100%',
        padding: '20px',
        margin: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    },

    h2: {
      paddingBottom: '33px',
    },
    '.close': {
      marginRight: '8px',
    },
  },
}));

export default BlurryDialog;
