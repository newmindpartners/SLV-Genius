import nufiCoreSdk from '@nufi/dapp-client-core';
import {
  all,
  call,
  CallEffect,
  delay,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import {
  walletConnectFailure,
  walletConnectRequest,
  walletConnectSuccess,
  walletDisconnectFailure,
  walletDisconnectRequest,
  walletDisconnectSuccess,
} from '~/redux/actions/wallet';
import { WalletAccount } from '~/redux/api/core';
import { getWalletType } from '~/redux/selector/wallet';
import {
  CardanoWallet,
  CardanoWalletAPIErrorCode,
  FullApiWallet,
  InitialWalletApi,
  isCardanoWalletApiError,
  UnconnectedWallet,
  WalletError,
  WalletErrorCode,
  WalletProxy,
  WalletType,
} from '~/types/wallet';
import { getErrorMessage } from '~/utils/error';
import { walletAddressHexToStakeKeyHash } from '~/utils/wallet';

import { userConnectWallet } from '../actions/user';

export let proxyWallet = new UnconnectedWallet();

export const getProxyWallet = (): WalletProxy => proxyWallet;

/**
 * Technically the `FullApiWallet` will be available on `window.cardano` when you
 * have connected with a wallet. However, we are accessing that API from the
 * returned wallet when calling `window.cardano.{walletType}.enable()` and
 * because of that it is omitted from here.
 */
export type Cardano = Record<WalletType, InitialWalletApi>;

declare global {
  interface Window {
    cardano: Cardano;
  }
}

function getCardano(): Cardano | undefined {
  // required due to storybook iframe
  // In the case that there is no parent
  // the parent object will be self referring
  return window.parent.window.cardano;
}

function getCardanoOrThrow(): Cardano {
  const cardano = getCardano();
  if (cardano) {
    return cardano;
  } else {
    throw new WalletError(WalletErrorCode.WALLET_GLOBAL_NOT_FOUND);
  }
}

export function getAvailableWalletTypes(): WalletType[] {
  const cardano = getCardano();
  return cardano ? getSupportedWalletTypes().filter((s) => cardano[s]) : [];
}

export function getSupportedWalletTypes(): WalletType[] {
  return Object.values(WalletType);
}

export function getWallets(): Record<
  WalletType,
  {
    title: string;
    isVisible: boolean;
    warning?: string;
    error?: string;
  }
> {
  return {
    [WalletType.ETERNL]: {
      title: 'Eternl',
      isVisible: true,
    },
    [WalletType.LACE]: {
      title: 'Lace',
      isVisible: true,
    },
    [WalletType.NAMI]: {
      title: 'Nami',
      isVisible: true,
    },
    [WalletType.YOROI]: {
      title: 'Yoroi',
      isVisible: true,
    },
    [WalletType.NUFI_SNAP]: {
      title: 'Metamask',
      isVisible: true,
    },
    [WalletType.FLINT]: {
      title: 'Flint',
      error:
        'Flint has been deprecated in Conway era. Please see official communication on X.',
      isVisible: true,
    },
  };
}

export function* getWalletAccount({
  getChangeAddress,
  getCollateralUtxo,
  getRewardAddresses,
  getUsedAddresses,
  getUnusedAddresses,
}: WalletProxy): Generator<
  CallEffect<[string | null, string[], string[], string[], string[]]>,
  WalletAccount | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> {
  const getWalletData = () =>
    Promise.all([
      getChangeAddress(),
      getCollateralUtxo(),
      getRewardAddresses(),
      getUsedAddresses(),
      getUnusedAddresses(),
    ]);

  const [
    walletAddress,
    collateralUtxo,
    walletRewardAddresses,
    walletUsedAddresses,
    walletUnusedAddresses,
  ]: Awaited<ReturnType<typeof getWalletData>> = yield call(getWalletData);

  return walletAddress
    ? {
        walletAddress,
        walletRewardAddresses,
        walletUsedAddresses,
        walletUnusedAddresses,
        collateralUtxo,
      }
    : null;
}

export function* disconnectWallet(
  action: ReturnType<typeof walletDisconnectRequest>,
): Generator<unknown, void, undefined> {
  const {
    payload: { callback },
  } = action;

  const selectedWalletType: ReturnType<typeof getWalletType> = yield select(
    getWalletType,
  );

  try {
    /**
     * The NuFi Snap wallet has a widget overlay which needs to be hidden when disconnecting.
     */
    if (selectedWalletType === WalletType.NUFI_SNAP) nufiCoreSdk.getApi().hideWidget();

    yield put(walletDisconnectSuccess({ onSuccess: callback?.onSuccess }));
  } catch (e) {
    yield put(
      walletDisconnectFailure({
        error: getErrorMessage(e),
        onFailure: callback?.onFailure,
      }),
    );
  }
}

export function* onWalletDisconnectSuccess(
  action: ReturnType<typeof walletDisconnectSuccess>,
): Generator<unknown, void, unknown> {
  const {
    payload: { onSuccess },
  } = action;

  yield onSuccess && onSuccess();
}

export function* onWalletDisconnectFailure(
  action: ReturnType<typeof walletDisconnectFailure>,
): Generator<unknown, void, unknown> {
  const {
    payload: { error, onFailure },
  } = action;
  console.error('DEBUG', 'disconnect wallet >>> ', {}, ' <<< ', error);
  yield onFailure && onFailure(new Error(error));
}

const getWallet = async (
  cardano: Cardano,
  walletType: WalletType,
): Promise<CardanoWallet | null> => {
  const initialWallet: InitialWalletApi | undefined = cardano[walletType];
  if (initialWallet) {
    try {
      const fullApiWallet = await initialWallet.enable();
      return { walletType, fullApiWallet };
    } catch (e) {
      console.error(e);
      return null;
    }
  } else {
    throw new WalletError(WalletErrorCode.WALLET_PROVIDER_NOT_FOUND);
  }
};

export function* connectWallet(
  action: ReturnType<typeof walletConnectRequest>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<unknown, void, any> {
  /**
    Because the init functionality of NuFi Snap wallet is not asynchronous,
    it may not be finished in time for the below wallet logic to utilise it.

    This issue (probably a design mistake, see App.tsx `initNufiDappCardanoSdk` for reference)
    we need to call `.isEnabled()` here to allow the init to finish.
  */

  if (window.cardano.nufiSnap && action.payload.walletType === WalletType.NUFI_SNAP) {
    yield call(async () => await window.cardano.nufiSnap.isEnabled?.());
  }

  const {
    payload: { callback },
  } = action;
  callback?.onRequest && callback.onRequest();

  try {
    const { walletType } = action.payload;
    const cardano: ReturnType<typeof getCardanoOrThrow> = yield call(getCardanoOrThrow);

    const wallet: CardanoWallet | undefined = yield call(getWallet, cardano, walletType);

    if (wallet) {
      const { fullApiWallet } = wallet;

      proxyWallet = {
        isConnected: (): boolean => true,

        getWalletType: (): WalletType => walletType,

        getBalance: fullApiWallet.getBalance,

        getCollateralUtxo: async (): Promise<string[]> => {
          /**
           * CIP-30 specifies `getCollateral` on connected wallet, but Nami does not
           * support this yet for some reason. It does have it part of `experimental`
           * though.
           */
          const getCollateral =
            fullApiWallet.getCollateral || fullApiWallet.experimental.getCollateral;
          return await getCollateral();
        },

        getChangeAddress: fullApiWallet.getChangeAddress,

        getRewardAddresses: fullApiWallet.getRewardAddresses,

        getUsedAddresses: fullApiWallet.getUsedAddresses,

        getUnusedAddresses: fullApiWallet.getUnusedAddresses,

        getNetworkId: fullApiWallet.getNetworkId,

        getUtxos: fullApiWallet.getUtxos,

        signTransaction: async (payload: string): Promise<string> => {
          return await walletSignTransaction(fullApiWallet, payload);
        },
      };

      const changeAddress: string = yield call(fullApiWallet.getChangeAddress);

      const walletStakeKeyHash = walletAddressHexToStakeKeyHash(changeAddress);

      if (walletStakeKeyHash) {
        yield put(
          userConnectWallet({
            walletType,
            walletStakeKeyHash,
            onSuccess: callback?.onSuccess,
            onFailure: callback?.onFailure,
          }),
        );
      } else {
        yield put(
          walletConnectFailure({
            error: new WalletError(WalletErrorCode.INVALID_OR_MISSING_STAKE_KEY_HASH),
            onFailure: callback?.onFailure,
          }),
        );
      }

      /**
       * Periodically check if stake key hash of a connected wallet has changed.
       * If it has, that must mean that a different account has connected to the app.
       * If so, we should re-run our wallet connection logic.
       */
      let walletChanged = false;
      while (!walletChanged && wallet) {
        yield delay(1 * 2000);

        const changeAddress: string = yield call(fullApiWallet.getChangeAddress);
        const latestWalletStakeKeyHash = walletAddressHexToStakeKeyHash(changeAddress);
        const walletAccountHasChanged = walletStakeKeyHash !== latestWalletStakeKeyHash;

        walletChanged = walletChanged || walletAccountHasChanged;
      }

      yield put(walletConnectRequest({ walletType }));
    } else {
      yield put(
        walletConnectFailure({
          error: new WalletError(WalletErrorCode.WALLET_NOT_FOUND),
          onFailure: callback?.onFailure,
        }),
      );
    }
  } catch (error) {
    yield put(walletConnectFailure({ error, onFailure: callback?.onFailure }));
  }

  async function walletSignTransaction(
    fullApiWallet: FullApiWallet,
    transactionPayload: string,
  ): Promise<string> {
    return await fullApiWallet.signTx(transactionPayload, true);
  }
}

export function* onWalletConnectSuccess(
  action: ReturnType<typeof walletConnectSuccess>,
): Generator<unknown, void, unknown> {
  const {
    payload: { onSuccess },
  } = action;

  yield onSuccess && onSuccess();
}

export function* onWalletConnectFailure(
  action: ReturnType<typeof walletConnectFailure>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Generator<any, void, any> {
  const {
    payload: { error, onFailure },
  } = action;

  /**
   * If the error thrown is part of the CIP-30 specification we will handle that here.
   * Otherwise we will pass it onto our callsite through `onFailure`.
   * https://cips.cardano.org/cips/cip30/#errortypes
   */
  if (isCardanoWalletApiError(error)) {
    switch (error.code) {
      /**
       * CIP-30 states that we should call `wallet.enable()` to re-establish connection if
       * this error `AccountChange` has been thrown. This is done in `walletConnectRequest`.
       * https://cips.cardano.org/cips/cip30/#errortypes
       */
      case CardanoWalletAPIErrorCode.AccountChange: {
        const walletType: ReturnType<typeof getWalletType> = yield select(getWalletType);

        if (walletType) {
          /**
           * Sometimes the wallet plugin struggles to find the new account if we re-connect too quickly.
           * Adding a 1 second delay here seems to prevent this intermittent behaviour.
           */
          yield delay(1 * 1000);
          yield put(walletConnectRequest({ walletType }));
        } else {
          yield put(walletDisconnectRequest({}));
        }
        break;
      }
      default:
        yield onFailure && onFailure(error);
    }
  } else {
    console.error('DEBUG', 'connect wallet >>> ', {}, ' <<< ', error);
    yield onFailure && onFailure(error);
  }
}

export default function* (): Generator<unknown, void, unknown> {
  yield all([
    takeLatest(walletConnectRequest.toString(), connectWallet),
    takeLatest(walletConnectSuccess.toString(), onWalletConnectSuccess),
    takeLatest(walletConnectFailure.toString(), onWalletConnectFailure),
    takeLatest(walletDisconnectRequest.toString(), disconnectWallet),
    takeLatest(walletDisconnectSuccess.toString(), onWalletDisconnectSuccess),
    takeLatest(walletDisconnectFailure.toString(), onWalletDisconnectFailure),
  ]);
}
