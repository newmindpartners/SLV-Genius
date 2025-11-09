import { Grid, styled } from '@mui/material';
import { shouldForwardProp } from '@mui/system';
import { FC } from 'react';
import Button from '~/components/Button/Button';

import { SubtleDescription } from './Typography';

const Wrapper = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const UnstakeText = styled(SubtleDescription)({
  lineHeight: '22px',
});

const UnstakeButton = styled(Button)(() => ({
  background: 'transparent !important',
  width: '100%',
  p: {
    color: '#C1CEF1',
  },
  '&:hover:disabled': {
    boxShadow: 'none',
  },
  '&:disabled': {
    pointerEvents: 'all !important',
    cursor: 'not-allowed !important',
    p: {
      color: '#6574A7',
    },
  },
}));

const ButtonsContainer = styled(Grid, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'isDisabled',
})<{ isDisabled?: boolean }>(({ isDisabled }) => ({
  cursor: isDisabled ? 'not-allowed' : 'unset',
}));

type ActionButtonsProps = {
  onClickUnstake: () => void;
  isUnstakingEnabled: boolean;
};

export const ActionButtons: FC<ActionButtonsProps> = ({
  onClickUnstake,
  isUnstakingEnabled,
}) => {
  const isUnstakingDisabled = !isUnstakingEnabled;

  return (
    <Wrapper>
      <ButtonsContainer container xs={12} item isDisabled={isUnstakingDisabled}>
        <UnstakeButton
          onClick={onClickUnstake}
          color="secondary"
          size="medium"
          disabled={isUnstakingDisabled}
        >
          <UnstakeText>
            {isUnstakingDisabled ? 'Unstaking isn’t available' : 'Unstake'}
          </UnstakeText>
        </UnstakeButton>
      </ButtonsContainer>
    </Wrapper>
  );
};
