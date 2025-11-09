import {adaAsset} from '~/seed/data/commonGroup/preprod';
import {usdmAsset} from '../../../projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '9ce3f826-c355-44c6-8b6d-aaec58612b8d',
  [usdmAsset.assetId, adaAsset.assetId]
);
