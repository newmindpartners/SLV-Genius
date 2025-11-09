import { Buffer } from 'buffer';
import { Hex } from '~/types/wallet';

export const hexFromByteArray = (bytes: Uint8Array): Hex => {
  return Buffer.from(bytes).toString('hex');
};

export const byteArrayFromHex = (str: Hex): Buffer => {
  return Buffer.from(str, 'hex');
};
