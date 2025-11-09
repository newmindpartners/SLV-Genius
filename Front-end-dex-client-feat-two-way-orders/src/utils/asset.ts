import { bech32 } from 'bech32';
import blake2b from 'blake2b';
import { Buffer } from 'buffer';

/**
 * CIP 14 - User-Facing Asset Fingerprint
 * https://cips.cardano.org/cips/cip14
 * https://github.com/Emurgo/cip14-js
 *
 * assetFingerprint := encodeBech32
 *       ( datapart = hash
 *         ( algorithm = 'blake2b'
 *         , digest-length = 20
 *         , message = policyId | assetName
 *         )
 *       , humanReadablePart = 'asset'
 *       )
 */
export const constructAssetId = (policyId: string, assetName: string): string => {
  const policyIdBuffer = Buffer.from(policyId, 'hex');
  const assetNameBuffer = Buffer.from(assetName, 'hex');
  const policyIdAssetNameBuffer = new Uint8Array([...policyIdBuffer, ...assetNameBuffer]);

  return bech32.encode(
    'asset',
    bech32.toWords(blake2b(20).update(policyIdAssetNameBuffer).digest('binary')),
  );
};
