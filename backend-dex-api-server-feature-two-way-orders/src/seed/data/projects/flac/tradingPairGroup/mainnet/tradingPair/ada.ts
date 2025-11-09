import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {flacAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '2645d6c8-de77-4044-84cc-e5b08d61dbfb',
  [flacAsset.assetId, adaAsset.assetId]
);
