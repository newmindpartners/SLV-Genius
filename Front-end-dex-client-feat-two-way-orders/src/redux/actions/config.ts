import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit';

export const cardanoNetwork = {
  preprod: 'preprod',
  mainnet: 'mainnet',
} as const;

export type CardanoNetwork = (typeof cardanoNetwork)[keyof typeof cardanoNetwork];

const isValidCardanoNetwork = (
  cardanoNetworkConfigTarget: string,
): cardanoNetworkConfigTarget is CardanoNetwork =>
  Object.values(cardanoNetwork).includes(cardanoNetworkConfigTarget as CardanoNetwork);

const prepareCardanoNetworkPayload = (cardanoNetworkConfigTarget: string) => {
  if (!isValidCardanoNetwork(cardanoNetworkConfigTarget)) {
    throw new Error(
      `Invalid configuration for cardano network: ${cardanoNetworkConfigTarget}`,
    );
  }

  return { payload: cardanoNetworkConfigTarget };
};

export const configSetCardanoNetwork: ActionCreatorWithPayload<CardanoNetwork, string> =
  createAction('CONFIG_SET_TARGET_CARDANO_NETWORK', prepareCardanoNetworkPayload);

export const configSetBaseUrl: ActionCreatorWithPayload<string, string> =
  createAction<string>('CONFIG_SET_BASE_URL');
