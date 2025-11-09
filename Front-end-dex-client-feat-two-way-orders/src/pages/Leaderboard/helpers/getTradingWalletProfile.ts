import { botttsNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { generateUniqueName } from '~/utils/nameGenerator';

export interface GetTradingWalletProfileData {
  tradingWalletStakeKeyHash: string;
  assetOneId: string;
  assetTwoId: string;
}

export interface TradingWalletProfile {
  name: string;
  avatar: string;
}

export const getTradingWalletProfile = (data: GetTradingWalletProfileData) => {
  const key = [data.tradingWalletStakeKeyHash, data.assetOneId, data.assetTwoId].join('');

  const name = generateUniqueName(key);

  const dicebearAvatar = createAvatar(botttsNeutral, {
    seed: name,
  });

  const avatar = dicebearAvatar.toDataUri();

  return { name, avatar };
};
