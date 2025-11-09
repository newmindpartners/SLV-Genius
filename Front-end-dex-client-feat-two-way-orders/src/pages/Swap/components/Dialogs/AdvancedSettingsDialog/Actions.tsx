import { Grid, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import GreenGradientButton from '~/components/Button/GreenGradientButton';

import { CancelButtonWrapper } from '../CancelOrderDialog';

export type ActionsProps = {
  onClose: () => void;
  onSave: () => void;
};

const Actions: FC<ActionsProps> = ({ onClose, onSave }) => (
  <Container container display="flex" gap="5px" marginTop="60px">
    <CancelButtonWrapper variant="contained" onClick={onClose}>
      <Typography variant="body3" color="textColor" textAlign="center" fontWeight="500">
        Cancel
      </Typography>
    </CancelButtonWrapper>

    <GreenGradientButton onClick={onSave}>Save</GreenGradientButton>
  </Container>
);

const Container = styled(Grid)(() => ({
  '& > .MuiButtonBase-root': {
    flex: 1,
    maxWidth: '300px',
  },
}));

export default Actions;
