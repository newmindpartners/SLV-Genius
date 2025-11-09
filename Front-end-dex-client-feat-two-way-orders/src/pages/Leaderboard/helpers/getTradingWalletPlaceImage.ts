export interface FeaturedTradingWallets {
  [key: number]: string;
}

export const featuredTradingWallets: FeaturedTradingWallets = {
  [1]: '/images/trading-wallet/trading-wallet-first-place.svg',
  [2]: '/images/trading-wallet/trading-wallet-second-place.svg',
  [3]: '/images/trading-wallet/trading-wallet-third-place.svg',
};

export const getTradingWalletPlaceImage = (place: number): string | null => {
  return featuredTradingWallets[place] ?? null;
};
