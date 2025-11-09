import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {cgiAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '43cc894f-8848-4655-96fe-f6041332343b',
  [cgiAsset.assetId, adaAsset.assetId]
);
