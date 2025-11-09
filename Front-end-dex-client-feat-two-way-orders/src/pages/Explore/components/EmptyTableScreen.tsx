import { Grid, styled, Typography } from '@mui/material';
import React, { FC, ReactElement, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '~/components/Button/Button';
import ConnectWalletButtonDialog from '~/components/ConnectWalletButtonDialog';
import { useWallet } from '~/hooks/wallet/wallet';

type EmptyTableScreenProps = {
  title: string;
  description: string;
  buttonText?: string;
};

const EmptyTableScreen: FC<EmptyTableScreenProps> = ({
  title,
  description,
  buttonText,
}): ReactElement => {
  const { isWalletConnected } = useWallet();
  const navigate = useNavigate();

  const handleOpenCreateOrderPage = useCallback(() => {
    navigate('/swap');
  }, []);

  return (
    <Wrapper container direction="column" alignItems="center" justifyContent="center">
      <Typography variant="h3" component="h3" color="textColor.main">
        {title}
      </Typography>
      <Typography
        color="buttonsInactive.main"
        m="22px 0 58px"
        variant="body3"
        component="h4"
      >
        {description}
      </Typography>
      {buttonText &&
        (isWalletConnected ? (
          <Button type="submit" onClick={handleOpenCreateOrderPage}>
            <Typography variant="body3" color="bgPrimaryGradient.contrastText">
              {buttonText}
            </Typography>
          </Button>
        ) : (
          <ConnectWalletButtonDialog />
        ))}
    </Wrapper>
  );
};

const Wrapper = styled(Grid)(({ theme }) => ({
  backgroundColor: '#202740',
  borderRadius: theme.borderRadius.md,
  height: '60vh',
  minHeight: '500px',
  button: {
    color: theme.palette.bgPrimaryGradient.contrastText,
    fontWeight: 800,
  },
}));

export default EmptyTableScreen;
