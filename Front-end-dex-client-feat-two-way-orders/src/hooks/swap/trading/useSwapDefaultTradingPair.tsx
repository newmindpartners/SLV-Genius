import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTradingPairs } from '~/context/tradingPairsContext';
import { getDefaultTradingPair, TradingPairAssets } from '~/utils/tradingPairsUtils';

const defaultFromAssetShortname = 'ADA';
const defaultToAssetShortname = 'GENS';

const useSwapDefaultTradingPair = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    tradingAssets,
    isLoadingTradingAssets,
    selectedAssets,
    handleSetTradingPairAssets,
  } = useTradingPairs();

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  useEffect(() => {
    if (!tradingAssets?.length || isLoadingTradingAssets) return;

    const fromAsset = tradingAssets.find((asset) => asset.assetId === fromParam);
    const toAsset = tradingAssets.find((asset) => asset.assetId === toParam);

    if (!fromAsset && !toAsset) {
      // If URL doesn't contain any assets -> set default Trading Pair
      const defaultTradingPair = getDefaultTradingPair(
        tradingAssets,
        defaultFromAssetShortname,
        defaultToAssetShortname,
      );
      handleSetTradingPairAssets(defaultTradingPair);
    } else {
      const newTradingPair: TradingPairAssets = {
        from: fromAsset || null,
        to: toAsset || null,
      };
      handleSetTradingPairAssets(newTradingPair);
    }
  }, [tradingAssets.length]);

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (selectedAssets.from) {
      queryParams.set('from', selectedAssets.from.assetId);
    }

    if (selectedAssets.to) {
      queryParams.set('to', selectedAssets.to.assetId);
    }

    if (selectedAssets.from || selectedAssets.to) {
      navigate(`/swap?${queryParams.toString()}`, { replace: true });
    }
  }, [selectedAssets]);
};

export default useSwapDefaultTradingPair;
