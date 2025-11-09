export type OrderSwapBestAvailableQuery = {
  toAssetId: string;
  fromAssetId: string;
  toAssetAmount?: string | null;
  fromAssetAmount?: string | null;
  slippagePercent?: number | null;
};
