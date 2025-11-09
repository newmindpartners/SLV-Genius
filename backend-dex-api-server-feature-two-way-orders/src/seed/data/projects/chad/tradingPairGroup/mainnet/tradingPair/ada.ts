import {chadAsset} from '../../../projectGroup/mainnet/asset';
import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  'c3dbd20a-c079-4779-b357-bdf6b75428b2',
  [chadAsset.assetId, adaAsset.assetId]
);
