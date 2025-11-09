import { Card as MuiCard, CardProps as MuiCardProps, styled } from '@mui/material';

export type CardColor = 'primary' | 'secondary';

export interface CardProps extends Omit<MuiCardProps, 'color'> {
  color?: CardColor;
}

export const Card = ({ color = 'primary', children, ...props }: CardProps) => (
  <Card.Wrapper $color={color} {...props}>
    {children}
  </Card.Wrapper>
);

Card.Wrapper = styled(MuiCard)<{ $color: CardColor }>`
  background: ${({ theme, $color }) =>
    $color === 'primary' ? '#202740' : theme.palette.bgCardRoundColor.main};

  border-radius: 1rem;
  padding: 0;
`;
