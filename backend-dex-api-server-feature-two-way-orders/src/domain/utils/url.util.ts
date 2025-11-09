import {CardanoNetwork, Hex} from '~/domain/models/cardano';
import {walletStakeKeyHashToStakeKeyBech32} from './wallet.util';

export const getImageUrlPng = (path: string): string => {
  return `/cdn/${path}.png`;
};

export const getAssetIconUrl = (projectAssetIdentifier: string): string =>
  `/cdn/images/projects/${projectAssetIdentifier}/asset.png`;

export const getCardanoTransactionUrl = (
  urlTemplate: string,
  transactionHash: Hex
): string => {
  const TX_HASH = 'TX_HASH';
  // This is the identifying name used in the declaration of the Cardano transaction endpoint constant
  return urlTemplate.replace(TX_HASH, transactionHash);
};

export const getCardanoStakeKeyUrl = (
  urlTemplate: string,
  stakeKeyHash: Hex,
  cardanoNetwork: CardanoNetwork
): string | null => {
  const STAKE_KEY_BECH32 = 'STAKE_KEY_BECH32';
  const stakeKeyBech32 = walletStakeKeyHashToStakeKeyBech32(
    stakeKeyHash,
    cardanoNetwork
  );

  // This is the identifying name used in the declaration of the Cardano stake key endpoint constant
  return stakeKeyBech32
    ? urlTemplate.replace(STAKE_KEY_BECH32, stakeKeyBech32)
    : null;
};
