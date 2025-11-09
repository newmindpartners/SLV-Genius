import { OptionsAsset } from '../../mock/knownTokens';

export const symbolAndName = (token: OptionsAsset): string[] =>
  token.assetId === 'lovelace' ? ['', ''] : token.assetId.split('.');
