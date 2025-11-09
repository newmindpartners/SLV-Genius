export type OptionsAsset = {
  assetId: string;
  ticker: string;
  logo: string;
  decimals: number;
  token: string;
};

export const knownTokens: OptionsAsset[] = [
  {
    assetId: 'lovelace',
    ticker: 'ADA',
    logo: '/cdn/ADA.png',
    decimals: 6,
    token: '',
  },
  {
    assetId: 'c6e65ba7878b2f8ea0ad39287d3e2fd256dc5c4160fc19bdf4c4d87e.7447454e53',
    ticker: 'GENS',
    logo: '/cdn/GENS.png',
    decimals: 6,
    token: '0014df1047454e53',
  },
  {
    assetId:
      '3d0b44e6303dd145d540a781b2bafa0b762355ffa63397736eede783.0014df104e494e4a415a',
    ticker: 'NINJAZ',
    logo: '/cdn/NINJAZ.png',
    decimals: 6,
    token: '0014df1047454e53',
  },
];
