export const byteArrayToHex = (bytes: Uint8Array) =>
  Array.from(bytes, (x) => x.toString(16).padStart(2, '0')).join('');
