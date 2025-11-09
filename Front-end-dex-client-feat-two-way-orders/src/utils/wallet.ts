import * as CML from '@dcspark/cardano-multiplatform-lib-browser';
import { Buffer } from 'buffer';
import { cardanoNetwork, CardanoNetwork } from '~/redux/actions/config';
import { Bech32, CBOR, Hex } from '~/types/wallet';

import { constructAssetId } from './asset';
import { byteArrayFromHex } from './buffer';

const getStakeKeyHashNetworkPrefix = (network: CardanoNetwork): string => {
  switch (network) {
    case cardanoNetwork.mainnet:
      return 'e1';
    case cardanoNetwork.preprod:
      return 'e0';
  }
};

export const walletAddressHexToStakeKeyHash = (walletAddress: Hex): Hex | undefined => {
  try {
    const addressBuffer = byteArrayFromHex(walletAddress);

    const address = CML.Address.from_bytes(addressBuffer);
    const baseAddress = CML.BaseAddress.from_address(address);
    const stakeCred = baseAddress?.stake_cred();
    const keyHash = stakeCred?.to_keyhash();

    const stakeKeyHashBytes = keyHash?.to_bytes();

    const stakeKeyHash = stakeKeyHashBytes
      ? Buffer.from(stakeKeyHashBytes).toString('hex')
      : undefined;

    address.free();
    baseAddress?.free();
    stakeCred?.free();
    keyHash?.free();

    return stakeKeyHash;
  } catch (error) {
    console.error(
      `Could not convert walletAddress: ${walletAddress} to stakeKeyHash`,
      error,
    );
    return undefined;
  }
};

export const convertStringToStakeKeyHash = (str: string): Hex | null => {
  /**
   * Check if it's a bech32 address. This is the most common format you'll find
   * when looking up a wallet in an explorer.
   */
  if (CML.Address.is_valid_bech32(str)) {
    return stakeKeyBech32ToInternalStakeKeyHash(str);
    /**
     * Check if it's a hex in the same length as our internal `walletStakeKeyHash`.
     * If so, we can assume it's a valid internal stake key hash.
     */
  } else if (isValidInternalStakeKeyHash(str)) {
    return str;
    /**
     * Lastly, attempt to convert a raw hex to an internal stake key hash.
     * This is the "raw" format commonly used in Cardano explorers.
     */
  } else {
    return rawHexStakeKeyHashToInternalStakeKeyHash(str);
  }
};

const isValidInternalStakeKeyHash = (stakeKeyHash: Hex): boolean => {
  return Buffer.from(stakeKeyHash, 'hex').length === 28;
};

/**
 * Unless address is 29 bytes long, CML.Address will throw error saying it's invalid CBOR.
 */
const isValidHexCardanoAddress = (address: string): boolean => {
  try {
    // This will throw if invalid hex format and length of 29 bytes.
    CML.Address.from_bytes(Buffer.from(address, 'hex'));
    // Another check to see if it's a valid Cardano address.
    return address.startsWith('e0') || address.startsWith('e1');
  } catch (_error) {
    return false;
  }
};

/**
 * Our internal stake key hash is 28 bytes long. We need to strip the first 2 bytes
 * before passing it to the API server.
 * The first 2 bytes are either e1 or e0, which indicate which Cardano network the
 * address is coming from.
 */
const rawHexStakeKeyHashToInternalStakeKeyHash = (
  rawHexStakeKeyHash: Hex,
): Hex | null => {
  if (isValidHexCardanoAddress(rawHexStakeKeyHash)) {
    return rawHexStakeKeyHash.substring(2);
  } else {
    return null;
  }
};

export const stakeKeyBech32ToInternalStakeKeyHash = (
  stakeAddress: Bech32,
): Hex | null => {
  const address = CML.Address.from_bech32(stakeAddress);
  const stakeKeyHash = CML.RewardAddress.from_address(address)
    ?.payment_cred()
    .to_keyhash()
    ?.to_bytes();

  return stakeKeyHash ? Buffer.from(stakeKeyHash).toString('hex') : null;
};

export const walletStakeKeyHashToStakeKeyBech32 = (
  stakeKeyHash: Hex,
  cardanoNetwork: CardanoNetwork,
): Bech32 | null => {
  try {
    const networkPrefix = getStakeKeyHashNetworkPrefix(cardanoNetwork);

    const stakeKeyHashWithNetworkPrefix = `${networkPrefix}${stakeKeyHash}`;

    const stakeKeyBech32 = CML.Address.from_bytes(
      Buffer.from(stakeKeyHashWithNetworkPrefix, 'hex'),
    ).to_bech32();

    return stakeKeyBech32;
  } catch (error) {
    console.error(
      `Could not convert Hex stake key: ${stakeKeyHash} to Bech32 stake key`,
      error,
    );

    return null;
  }
};

export const ADA_ASSET_ID = 'asset1xdz4yj4ldwlpsz2yjgjtt9evg9uskm8jrzjwhj';

export type AssetId = string;
export type Balance = string;
export type WalletBalanceRecord = Record<AssetId, Balance>;

export const parseWalletBalanceCborToRecord = (
  walletBalance: CBOR,
): WalletBalanceRecord => {
  const buffer = Buffer.from(walletBalance, 'hex');
  const value = CML.Value.from_bytes(buffer);
  const multiAsset = value?.multiasset();
  const assetsRaw = multiAsset?.to_js_value();
  const adaBalance = value?.coin().to_str();

  const assets: WalletBalanceRecord = { [ADA_ASSET_ID]: adaBalance };

  for (const [policyId, assetsMap] of Object.entries(assetsRaw || {})) {
    for (const [assetName, balance] of Object.entries(assetsMap)) {
      const assetId = constructAssetId(policyId, assetName);
      assets[assetId] = balance;
    }
  }

  return assets;
};

const nufiSdkUrl: Record<CardanoNetwork, string> = {
  mainnet: 'https://wallet.nu.fi',
  preprod: 'https://wallet-testnet-staging.nu.fi',
};

export const getNufiSdkUrl = (network: CardanoNetwork): string => nufiSdkUrl[network];
