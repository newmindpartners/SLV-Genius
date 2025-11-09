import { Grid, Avatar as MuiAvatar, styled, Typography } from '@mui/material';
import { FC } from 'react';

interface Props {
  avatar?: string;
  data: string;
}

const CellWrapper: FC<Props> = ({ data, avatar }) => {
  return (
    <CellGrid display="flex" alignItems="center" gap="12px">
      <AvatarWrapper>{avatar && <MuiAvatar src={avatar} />}</AvatarWrapper>
      <Typography>{data}</Typography>
    </CellGrid>
  );
};

const CellGrid = styled(Grid)({
  flexShrink: 0,
  minWidth: '110px',
  '& .MuiAvatar-root': {
    width: '28px',
    height: '28px',
  },
});

const AvatarWrapper = styled('div')({
  display: 'flex',
  width: '28px',
  height: '28px',

  '& img': {
    width: '100%',
    display: 'block',
  },
});

export default CellWrapper;
