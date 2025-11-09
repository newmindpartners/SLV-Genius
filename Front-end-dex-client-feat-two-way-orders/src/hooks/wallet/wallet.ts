import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardanoNetwork, cardanoNetwork } from '~/redux/actions/config';
import { walletConnectRequest } from '~/redux/actions/wallet';
import { walletDisconnectRequest } from '~/redux/actions/wallet';
import {
  getAvailableWalletTypes,
  getProxyWallet,
  getSupportedWalletTypes,
  getWallets,
} from '~/redux/saga/wallet';
import { getConfigTargetCardanoNetwork } from '~/redux/selector/config';
import {
  getConnectingWalletType,
  getWalletIsLoading,
  getWalletStakeKeyHash,
  getWalletType,
  isWalletConnected,
} from '~/redux/selector/wallet';
import { CallbackHandlers } from '~/types/shared';
import { WalletProxy, WalletType } from '~/types/wallet';

interface WalletHook {
  isWalletPresent: boolean;
  isWalletConnected: boolean;
  walletType: WalletType | undefined;
  connectingWalletType: WalletType | undefined;
  walletStakeKeyHash: string | undefined;
  supportedWallets: WalletType[];
  availableWallets: WalletType[];
  wallets: Record<
    WalletType,
    {
      warning?: string;
      error?: string;
      title?: string;
      isVisible?: boolean;
    }
  >;
  isWalletLoading?: boolean;
  getWalletChangeAddress: WalletProxy['getChangeAddress'];
  getWalletRewardAddresses: WalletProxy['getRewardAddresses'];
  getWalletUsedAddresses: WalletProxy['getUsedAddresses'];
  getWalletUnusedAddresses: WalletProxy['getUnusedAddresses'];
  getWalletCollateralUtxo: WalletProxy['getCollateralUtxo'];
  getWalletBalance: WalletProxy['getBalance'];
  getWalletNetworkStatus: () => Promise<WalletNetworkStatusType | null>;
  getWalletUtxos: WalletProxy['getUtxos'];
  handleWalletConnect: (walletType: WalletType, callback?: CallbackHandlers) => void;
  handleWalletDisconnect: (callback?: CallbackHandlers) => void;
}

enum WalletNetworkId {
  Mainnet = 1,
  Testnet = 0,
}

const isValidNetworkId = (networkId: number): networkId is WalletNetworkId =>
  Object.values(WalletNetworkId).includes(networkId);

/**
 * This enum is used by the clients to display a message to the user whether
 * they are connected to the correct network or should switch to another network.
 */
export enum WalletNetworkStatus {
  CorrectNetwork = 'CorrectNetwork',
  ShouldBeMainnet = 'ShouldBeMainnet',
  ShouldBePreprod = 'ShouldBePreprod',
}

/**
 * This maps the network id given to us by the CIP-30 wallets to a network
 * status we want to pass to the client.
 *
 * Eternl and Nami return `0` for both preview and preprod networks.
 * Because of this, we cannot tell the client whether they should switch
 * between preview and preprod.
 */
const walletNetworkIdToWalletNetworkStatusMap: Record<
  WalletNetworkId,
  WalletNetworkStatus
> = {
  [WalletNetworkId.Mainnet]: WalletNetworkStatus.ShouldBeMainnet,
  [WalletNetworkId.Testnet]: WalletNetworkStatus.ShouldBePreprod,
};

type WalletNetworkStatusType =
  (typeof WalletNetworkStatus)[keyof typeof WalletNetworkStatus];

const cardanoNetworkToNetworkId = (network: CardanoNetwork) => {
  switch (network) {
    case cardanoNetwork.mainnet:
      return WalletNetworkId.Mainnet;
    case cardanoNetwork.preprod:
    default:
      return WalletNetworkId.Testnet;
  }
};

export const useWallet = (): WalletHook => {
  const {
    getChangeAddress,
    getRewardAddresses,
    getUsedAddresses,
    getUnusedAddresses,
    getCollateralUtxo,
    getBalance,
    getNetworkId,
    getUtxos,
  } = getProxyWallet();
  const configTargetCardanoNetwork = useSelector(getConfigTargetCardanoNetwork);

  const getWalletNetworkStatus: WalletHook['getWalletNetworkStatus'] =
    useCallback(async () => {
      const walletNetworkId = await getNetworkId();
      const configNetworkId =
        configTargetCardanoNetwork &&
        cardanoNetworkToNetworkId(configTargetCardanoNetwork);

      /**
       * If `walletNetworkId` is not set, that is most likely because no wallet is connected.
       * If `configNetworkId` is not set, we cannot determine if we are on the correct network.
       * In either case we cannot provide any useful hints to the client so we return `null`.
       */
      const isValidNetworkIds =
        walletNetworkId !== null &&
        isValidNetworkId(walletNetworkId) &&
        configNetworkId !== null &&
        isValidNetworkId(configNetworkId);

      const networkStatus = isValidNetworkIds
        ? walletNetworkId === configNetworkId
          ? WalletNetworkStatus.CorrectNetwork
          : walletNetworkIdToWalletNetworkStatusMap[configNetworkId]
        : null;

      return networkStatus;
    }, [
      getNetworkId,
      cardanoNetworkToNetworkId,
      walletNetworkIdToWalletNetworkStatusMap,
    ]);

  const dispatch = useDispatch();

  const walletType = useSelector(getWalletType);
  const connectingWalletType = useSelector(getConnectingWalletType);
  const isConnected = useSelector(isWalletConnected);
  const walletStakeKeyHash = useSelector(getWalletStakeKeyHash);
  const isWalletLoading = useSelector(getWalletIsLoading);

  const supportedWallets = getSupportedWalletTypes();
  const availableWallets = getAvailableWalletTypes();
  const wallets = getWallets();

  const isWalletPresent = 0 == availableWallets.length;

  const handleWalletConnect: WalletHook['handleWalletConnect'] = (
    walletType,
    callback,
  ) => {
    dispatch(walletConnectRequest({ walletType, callback }));
  };

  const handleWalletDisconnect: WalletHook['handleWalletDisconnect'] = (callback) => {
    dispatch(walletDisconnectRequest({ callback }));
  };

  return {
    isWalletLoading,
    isWalletPresent,
    isWalletConnected: isConnected,
    walletType,
    connectingWalletType,
    walletStakeKeyHash,
    getWalletChangeAddress: getChangeAddress,
    getWalletRewardAddresses: getRewardAddresses,
    getWalletUsedAddresses: getUsedAddresses,
    getWalletUnusedAddresses: getUnusedAddresses,
    getWalletCollateralUtxo: getCollateralUtxo,
    getWalletBalance: getBalance,
    getWalletNetworkStatus,
    getWalletUtxos: getUtxos,
    supportedWallets,
    availableWallets,
    wallets,
    handleWalletConnect,
    handleWalletDisconnect,
  };
};
