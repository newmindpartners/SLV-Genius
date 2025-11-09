import { Button, CircularProgress, styled, Typography } from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';

type PaginationButtonProps = {
  disabled?: boolean;
  isLoading?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

const PaginationButton: FC<PaginationButtonProps> = ({
  isLoading,
  disabled,
  children,
  onClick,
}) => {
  const [isButtonTriggeredLoading, setIsButtonTriggeredLoading] = useState(false);

  const handleClick = () => {
    setIsButtonTriggeredLoading(true);
    onClick?.();
  };

  useEffect(() => {
    if (!isLoading) {
      setIsButtonTriggeredLoading(false);
    }
  }, [isLoading]);

  return (
    <ButtonStyled onClick={handleClick} disabled={disabled}>
      {isButtonTriggeredLoading ? (
        <CircularProgress color="info" size={23} />
      ) : (
        <Typography color="textColor.light" variant="roundWrapperCardDesc">
          {children}
        </Typography>
      )}
    </ButtonStyled>
  );
};
const ButtonStyled = styled(Button)(({ theme }) => ({
  minWidth: '150px',
  color: theme.palette.textColor.dark,
  background: 'transparent',
  border: '1px solid #28304E',
  padding: '10px',
  textTransform: 'none',

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    pointerEvents: 'all',
  },
}));

export default PaginationButton;
