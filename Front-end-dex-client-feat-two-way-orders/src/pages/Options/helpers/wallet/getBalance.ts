import { C } from 'lucid-cardano';

import { byteArrayToHex } from './byteArrayToHex';
import { hexToByteArray } from './hexToByteArray';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBalance = async (hexBalance: string): Promise<any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any = {};
  const balance = C.Value.from_bytes(hexToByteArray(hexBalance));

  value['lovelace'] = parseInt(balance.coin().to_str());

  const multiasset = balance.multiasset();

  if (multiasset) {
    for (let i = 0; i < multiasset.keys().len(); i++) {
      const symbol = multiasset.keys().get(i);
      const symbolText = byteArrayToHex(symbol.to_bytes());
      const assets = multiasset.get(symbol);

      if (assets) {
        for (let j = 0; j < assets.keys().len(); j++) {
          const token = assets.keys().get(j);
          const tokenNameHex = byteArrayToHex(token.name());
          const tokenAsset = symbolText + '.' + tokenNameHex;
          const tokenAmt = assets.get(token);

          if (tokenAmt) {
            value[tokenAsset] = parseInt(tokenAmt.to_str());
          }
        }
      }
    }
  }

  return value;
};
