import { useWalletBalanceRecord } from './walletBalanceRecord';

export const useWalletAssetIdBalanceRecord = (assetId: string): string | null => {
  const assetsMap = useWalletBalanceRecord();

  return assetsMap[assetId] || null;
};
