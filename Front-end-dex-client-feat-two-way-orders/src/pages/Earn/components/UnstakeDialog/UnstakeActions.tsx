import { CircularProgress } from '@mui/material';
import { Grid, styled } from '@mui/material';
import { FC, ReactElement } from 'react';
import Button from '~/components/Button/Button';

type DialogActionsProps = {
  isUnstakeLoading: boolean;
  handleReturnClick: () => void;
  handleUnstakeClick: () => void;
};

const UnstakeActions: FC<DialogActionsProps> = ({
  isUnstakeLoading,
  handleReturnClick,
  handleUnstakeClick,
}): ReactElement => {
  const isUnstakeDisabled = isUnstakeLoading;
  return (
    <Wrapper container gap="16px">
      <Button color="default" className="returnButton" onClick={handleReturnClick}>
        No, return
      </Button>
      <Button
        color="default"
        className="unstakeButton"
        onClick={handleUnstakeClick}
        disabled={isUnstakeDisabled}
      >
        {isUnstakeLoading && <CircularProgress size={15} color="primary" />} Yes, unstake
      </Button>
    </Wrapper>
  );
};
const Wrapper = styled(Grid)(({ theme }) => ({
  button: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    padding: '15px 0',
    color: '#ffffff',
  },
  '.MuiCircularProgress-root': {
    marginRight: '8px',
  },
  '.returnButton': {
    background: '#28304E',
  },
  '.unstakeButton': {
    background: 'linear-gradient(90deg, #FF4A4C 0%, #FF4A8B 100%)',

    '&:disabled': {
      cursor: 'not-allowed',
      pointerEvents: 'all',
      opacity: 0.3,
      color: '#fff',
      boxShadow: 'none !important',
    },
  },
}));

export default UnstakeActions;
