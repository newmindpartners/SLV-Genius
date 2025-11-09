import {huntAsset} from '../../../projectGroup/mainnet/asset';
import {usdmAsset} from '~/seed/data/projects/usdm/projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'ce46df8f-dd25-4b45-ba4c-776a9ba33627',
  [huntAsset.assetId, usdmAsset.assetId]
);
