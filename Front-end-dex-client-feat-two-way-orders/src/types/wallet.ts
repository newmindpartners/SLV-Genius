import { BigNum } from '@dcspark/cardano-multiplatform-lib-browser';
import { inRange } from 'lodash';
import { UserConnect } from '~/redux/api/core';
import { Cardano } from '~/redux/saga/wallet';

import { FailurePayload } from './error';
import { CallbackHandlers } from './shared';

declare global {
  interface Window {
    cardano: Cardano;
  }
}

/**
 * CIP-30 initial wallet api
 * See https://cips.cardano.org/cips/cip30/#initialapi
 */
export interface InitialWalletApi {
  isEnabled?: () => Promise<boolean>;
  enable: () => Promise<FullApiWallet>;
}

/**
 * CIP-30 full wallet api
 * See https://cips.cardano.org/cips/cip30/#fullapi
 */
type Address = string;
export type CBOR = string;
export type Hex = string;
export type Bech32 = string;
type Utxo = string;
type Paginate = {
  page: number;
  limit: number;
};
export interface FullApiWallet {
  getCollateral: () => Promise<Address[]>;

  getChangeAddress: () => Promise<Address>;

  getRewardAddresses: () => Promise<Address[]>;

  getUsedAddresses: () => Promise<Address[]>;

  getUnusedAddresses: () => Promise<Address[]>;

  getBalance: () => Promise<CBOR>;

  getNetworkId: () => Promise<number>;

  getUtxos: (amount?: CBOR, paginate?: Paginate) => Promise<Utxo[]>;

  signTx: (payload: string, partialSign: boolean) => Promise<string>;

  /**
   * For some reason Nami still only has `getCollateral` on `experimental`.
   * https://cips.cardano.org/cips/cip30/#experimentalapi
   */
  experimental: {
    getCollateral: FullApiWallet['getCollateral'];
  };
}

export interface CardanoWallet {
  walletType: WalletType;
  fullApiWallet: FullApiWallet;
}

/**
 * CIP-30 wallet errors
 * See https://cips.cardano.org/cips/cip30/#errortypes
 */
const CARDANO_WALLET_API_ERROR_CODE_START = -4;
const CARDANO_WALLET_API_ERROR_CODE_END = -1;

export enum CardanoWalletAPIErrorCode {
  InvalidRequest = -1,
  InternalError = -2,
  Refused = -3,
  AccountChange = -4,
}

type CardanoWalletAPIError = Error & {
  code: CardanoWalletAPIErrorCode;
  info: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCardanoWalletApiError = (error: any): error is CardanoWalletAPIError =>
  'code' in error &&
  typeof error.code === 'number' &&
  inRange(
    error.code,
    CARDANO_WALLET_API_ERROR_CODE_START,
    CARDANO_WALLET_API_ERROR_CODE_END,
  ) &&
  'info' in error &&
  typeof error.info === 'string';

export enum WalletErrorCode {
  INVALID_OR_MISSING_STAKE_KEY_HASH = 'INVALID_OR_MISSING_STAKE_KEY_HASH',
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
  WALLET_GLOBAL_NOT_FOUND = 'WALLET_GLOBAL_NOT_FOUND',
  WALLET_ACCOUNT_NOT_FOUND = 'WALLET_ACCOUNT_NOT_FOUND',
  WALLET_TYPES_NOT_FOUND = 'WALLET_TYPES_NOT_FOUND',
  WALLET_PROVIDER_NOT_FOUND = 'WALLET_PROVIDER_NOT_FOUND',
  FUNCTION_NOT_IMPLEMENTED = 'FUNCTION_NOT_IMPLEMENTED',
  USER_DECLINED_SIGNING = 'USER_DECLINED_SIGNING',
  USER_SIGNING_FAILED = 'USER_SIGNING_FAILED',
}

const CARDANO_WALLET_DATA_SIGN_ERROR_CODE_START = 1;
const CARDANO_WALLET_DATA_SIGN_ERROR_CODE_END = 4;

/**
 * CIP-30 data sign errors
 * See https://cips.cardano.org/cips/cip30/#datasignerror
 */
export enum CardanoWalletDataSignErrorCode {
  ProofGeneration = 1,
  AddressNotPK = 2,
  UserDeclined = 3,
}

type CardanoWalletDataSignError = Error & {
  code: CardanoWalletDataSignErrorCode;
  info: string;
};

export const isCardanoWalletDataSignError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
): error is CardanoWalletDataSignError =>
  'code' in error &&
  inRange(
    error.code,
    CARDANO_WALLET_DATA_SIGN_ERROR_CODE_START,
    CARDANO_WALLET_DATA_SIGN_ERROR_CODE_END,
  ) &&
  'info' in error &&
  typeof error.info === 'string';

export class WalletError extends Error {
  constructor(readonly errorCode: WalletErrorCode, message: string | null = null) {
    super(message || errorCode);
  }
}

/**
 * Supported wallet types
 *
 * String keys are sensitive
 * Keys must match expected keys in cardano object.
 */
export enum WalletType {
  NAMI = 'nami',
  ETERNL = 'eternl',
  FLINT = 'flint',
  YOROI = 'yoroi',
  LACE = 'lace',
  NUFI_SNAP = 'nufiSnap',
}

export type Wallet = Pick<UserConnect, 'walletStakeKeyHash'> & {
  walletType: WalletType;
};

export interface WalletProxy {
  isConnected: () => boolean;

  getWalletType: () => WalletType;

  getBalance: () => Promise<string | null>;

  getChangeAddress: () => Promise<string | null>;

  getRewardAddresses: () => Promise<string[]>;

  getUsedAddresses: () => Promise<string[]>;

  getUnusedAddresses: () => Promise<string[]>;

  getCollateralUtxo: () => Promise<string[]>;

  getNetworkId: () => Promise<number | null>;

  getUtxos: (amount?: CBOR, paginate?: Paginate) => Promise<string[]>;

  signTransaction: (payload: string) => Promise<string>;
}

export class UnconnectedWallet implements WalletProxy {
  isConnected(): boolean {
    return false;
  }

  getWalletType(): WalletType {
    throw new WalletError(WalletErrorCode.WALLET_TYPES_NOT_FOUND);
  }

  getBalance: WalletProxy['getBalance'] = () => {
    return Promise.resolve(null);
  };

  getChangeAddress: () => Promise<string | null> = () => {
    return Promise.resolve(null);
  };

  getRewardAddresses: WalletProxy['getRewardAddresses'] = () => {
    return Promise.resolve([]);
  };

  getUsedAddresses: WalletProxy['getUsedAddresses'] = () => {
    return Promise.resolve([]);
  };

  getUnusedAddresses: WalletProxy['getUnusedAddresses'] = () => {
    return Promise.resolve([]);
  };

  getCollateralUtxo: WalletProxy['getCollateralUtxo'] = () => {
    return Promise.resolve([]);
  };

  getNetworkId: WalletProxy['getNetworkId'] = () => {
    return Promise.resolve(null);
  };

  getUtxos: WalletProxy['getUtxos'] = () => {
    return Promise.resolve([]);
  };

  signTransaction(payload: string): Promise<string> {
    throw new WalletError(
      WalletErrorCode.FUNCTION_NOT_IMPLEMENTED,
      `UnconnectedWallet signedTransaction not implemented. Payload: ${payload}`,
    );
  }
}

export interface WalletAsset {
  policyId: string;
  assetName: string;
  assetAmount: BigNum;
}

export interface WalletState {
  pending: boolean;
  error?: string;
}

export type WalletAssets = WalletAsset[];

export type WalletConnectRequestPayload = Pick<Wallet, 'walletType'> & {
  callback?: CallbackHandlers;
};

export type WalletConnectSuccessPayload = Wallet & {
  onSuccess?: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WalletConnectFailurePayload = { error: any } & {
  onFailure: CallbackHandlers['onFailure'];
};

export type WalletDisconnectRequestPayload = {
  callback?: CallbackHandlers;
};

export type WalletDisconnectSuccessPayload = {
  onSuccess?: () => void;
};

export type WalletDisconnectFailurePayload = FailurePayload & {
  onFailure: CallbackHandlers['onFailure'];
};
