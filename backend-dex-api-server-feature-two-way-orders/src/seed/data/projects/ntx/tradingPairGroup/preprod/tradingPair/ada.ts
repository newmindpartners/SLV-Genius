import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {assets} from '../../../projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '00bc31e0-2009-4b2d-a0e3-d80e505a8caf',
  [assets.mNtx.assetId, adaAsset.assetId]
);
