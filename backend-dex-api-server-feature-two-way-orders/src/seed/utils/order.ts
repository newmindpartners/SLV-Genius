import {map} from 'lodash';
import {calcPrice, calcUnitMultiplier} from '~/domain/utils/asset.util';
import {times} from '~/domain/utils/math.util';
import * as Seed from '~/seed/types';

export const getProjectRoundName = (number: number): string =>
  `Round ${number}`;

const calcQuoteAssetRaisedAmount = (
  baseAssetSubmittedAmount: Seed.Round['baseAssetSubmittedAmount'],
  quoteAssetAmount: Seed.Round['priceLovelace'],
  baseAssetAmount: BigInt
): bigint => {
  if (
    typeof baseAssetSubmittedAmount === 'bigint' &&
    typeof quoteAssetAmount === 'bigint' &&
    typeof baseAssetAmount === 'bigint'
  ) {
    return BigInt(
      times(
        baseAssetSubmittedAmount.toString(),
        calcPrice(quoteAssetAmount.toString(), baseAssetAmount.toString())
      )
    );
  } else {
    return BigInt(0);
  }
};

const setQuoteAssetRaisedAmount = (
  object: Omit<Seed.Round, 'quoteAssetRaisedAmount'>,
  baseAssetSubmittedAmount: Seed.Round['baseAssetSubmittedAmount'],
  quoteAssetAmount: Seed.Round['priceLovelace'],
  baseAssetAmount: BigInt
): Seed.Round => {
  return {
    ...object,
    quoteAssetRaisedAmount: calcQuoteAssetRaisedAmount(
      baseAssetSubmittedAmount,
      quoteAssetAmount,
      baseAssetAmount
    ),
  };
};

export const createRound = (
  asset: Seed.Asset,
  roundInput: Omit<Seed.Round, 'quoteAssetRaisedAmount'>
): Seed.Round => {
  const baseAssetAmount = BigInt(calcUnitMultiplier(asset.decimalPrecision));
  const {priceLovelace, baseAssetSubmittedAmount} = roundInput;
  const round = {...roundInput};
  return setQuoteAssetRaisedAmount(
    round,
    baseAssetSubmittedAmount,
    priceLovelace,
    baseAssetAmount
  );
};

const bigZero = BigInt(0);

export const getTotalRaised = (rounds: Seed.Round[]) =>
  rounds.reduce(
    (prev, curr) =>
      prev +
      (curr?.quoteAssetRaisedAmount
        ? BigInt(curr.quoteAssetRaisedAmount)
        : bigZero),
    bigZero
  );

export const getTotalAllocationAmount = (rounds: Seed.Round[]) =>
  rounds.reduce(
    (prev, curr) =>
      prev +
      (curr?.baseAssetAllocationAmount
        ? BigInt(curr.baseAssetAllocationAmount)
        : bigZero),
    bigZero
  );

export const prepareRoundWhitelist = (
  whitelistedWallets: string[]
): Seed.RoundWhitelist[] =>
  map(whitelistedWallets, (address: string) => ({
    walletStakeKeyHash: address,
  }));

export const getWhiteListConnectOrCreate = (
  roundId: string,
  preparedRoundWhitelist: Seed.RoundWhitelist[]
): Seed.Round['roundWhitelist'] => {
  return {
    connectOrCreate: map(preparedRoundWhitelist, whitelist => ({
      where: {
        roundId_walletStakeKeyHash: {
          roundId: roundId,
          walletStakeKeyHash: whitelist.walletStakeKeyHash,
        },
      },
      create: whitelist,
    })),
  };
};
