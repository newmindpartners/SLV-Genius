import { DialogContent as MUIDialogContent, styled } from '@mui/material';
import { FC } from 'react';

export interface Props {
  children: React.ReactElement;
}

const DialogContent: FC<Props> = ({ children }) => (
  <DialogContentStyled>{children}</DialogContentStyled>
);

const DialogContentStyled = styled(MUIDialogContent)({
  '& .MuiDialogContent-root': {
    marginTop: '50px',
    padding: 0,
  },
});

export default DialogContent;
