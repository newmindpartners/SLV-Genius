/**
 * convert string to snake case
 *
 * @param s string
 *
 * @return a string in snake_case
 */
export function snakeCase(s: string): string {
  return s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export const stringOrNull = (value: string | undefined) =>
  !!value || value === '' ? value : null;

export function splitAssetIdPair(assetPair: string): {
  baseAssetId: string;
  quoteAssetId: string;
} {
  const [baseAssetId, quoteAssetId] = assetPair.split('-');
  return {baseAssetId, quoteAssetId};
}
