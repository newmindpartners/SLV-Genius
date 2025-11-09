import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {meldAsset} from '../../../projectGroup/preprod/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '239595a8-7d92-4fc7-b306-73a6360e48c7',
  [meldAsset.assetId, adaAsset.assetId]
);
