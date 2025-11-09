import { Button as MuiButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { FC, ReactElement, ReactNode } from 'react';

export interface Props {
  children: React.ReactElement | string;
  onClick?: () => void;
  startIcon?: React.ReactElement | ReactNode;
}

const ShowMoreButton: FC<Props> = ({
  children,
  onClick,
  startIcon,
}: Props): ReactElement => {
  return (
    <ShowMore onClick={onClick} startIcon={startIcon}>
      <Typography variant="body3">{children}</Typography>
    </ShowMore>
  );
};

const ShowMore = styled(MuiButton)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.primary.main,
  border: 'none',
  cursor: 'pointer',
  textTransform: 'none',
  padding: 0,
}));

export default ShowMoreButton;
