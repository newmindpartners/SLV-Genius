import {adaAsset} from '~/seed/data/commonGroup/mainnet';
import {hoskyAsset} from '../../../projectGroup/mainnet/asset';
import {createTradingPair} from '~/seed/utils/tradingPair';

export const tradingPair = createTradingPair(
  '23891211-d18f-457c-863d-25684b75891b',
  [hoskyAsset.assetId, adaAsset.assetId]
);
