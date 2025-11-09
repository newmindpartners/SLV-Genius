import { styled } from '@mui/material';
import { TradingWallet } from '~/redux/api';

import { TradingWalletCard } from '../TradingWalletCard';
import { TradingWalletCardSkeleton } from '../TradingWalletCardSkeleton';

export interface TradingWalletGridProps {
  tradingWallets: TradingWallet[];
  isLoading?: boolean;
  skeletonCount?: number;
  showPlace?: boolean;
  onViewTradingWallet?: (id: string) => void;
}

export const TradingWalletGrid = ({
  tradingWallets,
  isLoading,
  skeletonCount,
  showPlace,
  onViewTradingWallet,
}: TradingWalletGridProps) => {
  if (isLoading) {
    return (
      <TradingWalletGrid.Wrapper>
        {Array.from({ length: skeletonCount ?? 10 }).map((_, index) => (
          <TradingWalletCardSkeleton key={index} />
        ))}
      </TradingWalletGrid.Wrapper>
    );
  }

  return (
    <TradingWalletGrid.Wrapper>
      {tradingWallets.map((tradingWallet, index) => (
        <TradingWalletCard
          key={tradingWallet.tradingWalletId}
          data={tradingWallet}
          place={showPlace ? index + 1 : undefined}
          onViewTradingWallet={() => onViewTradingWallet?.(tradingWallet.tradingWalletId)}
        />
      ))}
    </TradingWalletGrid.Wrapper>
  );
};

TradingWalletGrid.Wrapper = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22.5rem, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
`;
