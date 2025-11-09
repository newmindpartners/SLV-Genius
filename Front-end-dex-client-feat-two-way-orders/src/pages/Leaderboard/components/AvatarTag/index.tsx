import { Avatar, styled, Typography } from '@mui/material';

export interface AvatarTagProps {
  src?: string;
  label: string;
}

export const AvatarTag = ({ src, label }: AvatarTagProps) => (
  <AvatarTag.Wrapper>
    <AvatarTag.Avatar src={src} />
    <AvatarTag.Typography variant="body2">{label}</AvatarTag.Typography>
  </AvatarTag.Wrapper>
);

AvatarTag.Avatar = styled(Avatar)`
  width: 1.5rem;
  height: 1.5rem;
`;

AvatarTag.Typography = styled(Typography)`
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

AvatarTag.Wrapper = styled('div')`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;
