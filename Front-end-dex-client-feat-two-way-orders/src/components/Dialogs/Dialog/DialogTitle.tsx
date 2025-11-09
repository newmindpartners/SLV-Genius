import { DialogTitle as MUIDialogTitle, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

import { PopupCloseSvg } from '../../Icons/PopupCloseSvg';

export interface Props {
  title: string;
  onClose: () => void;
}

const DialogTitle: FC<Props> = ({ title, onClose }) => (
  <DialogTitleStyled>
    <Box className={'heading'}>
      <Box className={'close'} onClick={onClose}>
        <PopupCloseSvg />
      </Box>
    </Box>
    <Box id="alert-dialog-title">
      <Typography variant="h4">{title}</Typography>
    </Box>
  </DialogTitleStyled>
);

const DialogTitleStyled = styled(MUIDialogTitle)(({ theme }) => ({
  padding: '0',
  paddingBottom: '33px',

  '& .heading': {
    display: 'flex',
    justifyContent: 'end',
    '& .close': {
      cursor: 'pointer',
    },
  },

  '& #alert-dialog-title': {
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    paddingBottom: '30px',
    '& .close': {
      marginRight: '8px',
    },
  },
}));

export default DialogTitle;
