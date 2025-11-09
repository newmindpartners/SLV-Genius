import { Avatar, Grid, styled } from '@mui/material';

import { getTradingWalletPlaceImage } from '../../helpers/getTradingWalletPlaceImage';

export interface TradingWalletAvatarProps {
  src?: string;
  size: string;
  place?: number;
}

export const TradingWalletAvatar = ({ size, src, place }: TradingWalletAvatarProps) => {
  const placeImage = place ? getTradingWalletPlaceImage(place) : null;

  if (!placeImage) {
    return (
      <TradingWalletAvatar.DefaultAvatar src={src} sx={{ width: size, height: size }} />
    );
  }

  return (
    <TradingWalletAvatar.Wrapper
      sx={{ height: size }}
      alignItems="center"
      justifyContent="center"
    >
      <TradingWalletAvatar.Masked src={src} sx={{ height: size, width: size }} />
      <TradingWalletAvatar.Mask sx={{ height: size }} src={placeImage} />
    </TradingWalletAvatar.Wrapper>
  );
};

TradingWalletAvatar.DefaultAvatar = styled(Avatar)({
  background: '#C1CEF1',
});

TradingWalletAvatar.Masked = styled(Avatar)({
  transform: 'scale(0.8)',
  position: 'absolute',
});

TradingWalletAvatar.Mask = styled('img')({
  height: '100%',
  userSelect: 'none',
  pointerEvents: 'none',
  zIndex: 1,
});

TradingWalletAvatar.Wrapper = styled(Grid)({
  display: 'flex',
  position: 'relative',
});
