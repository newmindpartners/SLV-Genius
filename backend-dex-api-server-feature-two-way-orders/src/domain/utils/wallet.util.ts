import * as CML from '@dcspark/cardano-multiplatform-lib-nodejs';

import * as Sentry from '@sentry/node';

import {Bech32, CardanoNetwork, Hex} from '~/domain/models/cardano';

const getStakeKeyHashNetworkPrefix = (
  cardanoNetwork: CardanoNetwork
): string => {
  switch (cardanoNetwork) {
    case CardanoNetwork.MAINNET:
      return 'e1';
    case CardanoNetwork.PREVIEW:
    case CardanoNetwork.PREPROD:
      return 'e0';
  }
};

export const walletAddressHexToBech32 = (hexWalletAddress: Hex): Bech32 => {
  const address = CML.Address.from_hex(hexWalletAddress);
  const walletAddressBech32 = address.to_bech32();

  address.free();

  return walletAddressBech32;
};

export const walletAddressBech32ToHex = (walletAddress: Bech32): Hex => {
  const address = CML.Address.from_bech32(walletAddress);
  const walletAddressHex = address.to_hex();

  address.free();

  return walletAddressHex;
};

const addressToStakeKeyHash = (address: CML.Address): Hex | undefined => {
  const baseAddress = CML.BaseAddress.from_address(address);
  const stakeCred = baseAddress?.stake();

  const stakeKeyHash = stakeCred?.as_pub_key()?.to_hex();

  address.free();
  baseAddress?.free();
  stakeCred?.free();

  return stakeKeyHash;
};

export const walletAddressHexToStakeKeyHash = (
  walletAddress: Hex
): Hex | undefined => {
  try {
    const address = CML.Address.from_hex(walletAddress);
    const stakeKeyHash = addressToStakeKeyHash(address);

    return stakeKeyHash;
  } catch (error) {
    Sentry.captureException(error);
    console.error(
      `Could not convert Hex walletAddress: ${walletAddress} to stakeKeyHash`,
      error
    );

    return undefined;
  }
};

export const walletAddressBech32ToStakeKeyHash = (
  walletAddress: Bech32
): Hex | undefined => {
  try {
    const address = CML.Address.from_bech32(walletAddress);
    const stakeKeyHash = addressToStakeKeyHash(address);

    return stakeKeyHash;
  } catch (error) {
    Sentry.captureException(error);
    console.error(
      `Could not convert Bech32 walletAddress: ${walletAddress} to stakeKeyHash`,
      error
    );

    return undefined;
  }
};

export const walletStakeKeyBech32ToStakeKeyHash = (
  stakeAddress: Bech32
): Hex | undefined => {
  const address = CML.Address.from_bech32(stakeAddress);

  const stakeKeyHash = CML.RewardAddress.from_address(address)
    ?.payment()
    ?.as_pub_key()
    ?.to_hex();

  return stakeKeyHash;
};

export const walletStakeKeyHashToStakeKeyBech32 = (
  stakeKeyHash: Hex,
  cardanoNetwork: CardanoNetwork
): Bech32 | null => {
  try {
    const networkPrefix = getStakeKeyHashNetworkPrefix(cardanoNetwork);

    const stakeKeyHashWithNetworkPrefix = `${networkPrefix}${stakeKeyHash}`;

    const stakeKeyBech32 = CML.Address.from_hex(
      stakeKeyHashWithNetworkPrefix
    ).to_bech32();

    return stakeKeyBech32;
  } catch (error) {
    console.error(
      `Could not convert Hex stake key: ${stakeKeyHash} to Bech32 stake key`,
      error
    );

    return null;
  }
};

type CBOR = string;
type PolicyId = Hex;
type AssetName = Hex;
type AssetAmount = number;

export const getAssetsFromWalletBalance = (
  balance: CBOR
): {
  policyId: Hex;
  assets: {
    assetName: Hex;
    amount: number;
  }[];
}[] => {
  const value = CML.Value.from_cbor_hex(balance);

  const multiAsset: Record<
    PolicyId,
    Record<AssetName, AssetAmount>
  > = JSON.parse(value.to_json()).multiasset;

  const policyIdAssetsMap = Object.entries(multiAsset).map(
    ([policyId, assetsRecord]) => {
      const assets = Object.entries(assetsRecord).map(
        ([assetName, amount]) => ({
          assetName,
          amount,
        })
      );

      return {
        policyId,
        assets,
      };
    }
  );

  value.free();

  return policyIdAssetsMap;
};
