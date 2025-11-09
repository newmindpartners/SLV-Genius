import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {usdmAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '626bb474-7ab1-4993-b98b-294f0ef586ed',
  [usdmAsset.assetId, adaAsset.assetId]
);
