import { styled } from '@mui/material/styles';
import React from 'react';
import { WalletType } from '~/types/wallet';

const walletTypeIcon = (walletType: WalletType) => {
  switch (walletType) {
    case WalletType.ETERNL:
      return '/images/wallets/eternl.png';
    case WalletType.NAMI:
      return '/images/wallets/nami.png';
    case WalletType.FLINT:
      return '/images/wallets/flint.png';
    case WalletType.YOROI:
      return '/images/wallets/yoroi.png';
    case WalletType.LACE:
      return '/images/wallets/lace.png';
    case WalletType.NUFI_SNAP:
      return '/images/wallets/metamask.png';
  }
};

type Props = {
  walletType: WalletType;
};

const Image = styled('img')(() => ({
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'contain',
}));

const WalletIcon: React.FC<Props> = ({ walletType }) => (
  <Image src={walletTypeIcon(walletType)} alt={walletType} />
);

export default WalletIcon;
