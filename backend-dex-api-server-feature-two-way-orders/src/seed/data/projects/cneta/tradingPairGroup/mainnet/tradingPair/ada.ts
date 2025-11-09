import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {cnetaAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '89cd36f1-1754-4ba7-8ed5-2303b5727de1',
  [cnetaAsset.assetId, adaAsset.assetId]
);
