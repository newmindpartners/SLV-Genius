import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, ReactElement } from 'react';

import Button, { ButtonProps } from './Button';

export interface Props {
  children: ReactElement | string;
  onClick: () => void;
}

const BackPageButton: FC<Props> = ({
  children,
  onClick,
  ...props
}: ButtonProps): ReactElement => (
  <BackPageButtonWrapper>
    <Button
      size="small"
      color="transparent"
      onClick={onClick}
      startIcon={<ArrowBackIcon />}
      {...props}
    >
      <Typography variant="body3">{children}</Typography>
    </Button>
  </BackPageButtonWrapper>
);

const BackPageButtonWrapper = styled('div')(({ theme }) => ({
  '& button': {
    color: theme.palette.buttonsInactive.main,
    border: 'none',
  },
}));

export default BackPageButton;
