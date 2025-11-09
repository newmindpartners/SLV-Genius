import { Buffer } from 'buffer';

export const convertHexToAscii = (hexStr: string) => {
  try {
    return Buffer.from(hexStr, 'hex').toString();
  } catch (error) {
    return null;
  }
};
