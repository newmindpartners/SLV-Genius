export type Hex = string;

export type Bech32 = string;

export type Rational = {
  numerator: bigint;
  denominator: bigint;
};

export enum CardanoNetwork {
  MAINNET = 'MAINNET',
  PREPROD = 'PREPROD',
  PREVIEW = 'PREVIEW',
}

export type UnspentTransactionOutput = string; // (transactionHash # outputIndex)
