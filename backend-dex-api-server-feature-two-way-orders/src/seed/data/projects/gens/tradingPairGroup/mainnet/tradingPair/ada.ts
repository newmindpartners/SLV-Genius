import {gensAsset} from '../../../projectGroup/mainnet';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'dda055b1-d274-41c9-b01c-173ef3d7699f',
  [gensAsset.assetId, adaAsset.assetId]
);
