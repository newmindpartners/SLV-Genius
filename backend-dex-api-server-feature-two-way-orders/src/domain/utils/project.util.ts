import {find, includes} from 'lodash';

import {now} from '~/domain/utils/date.util';
import {times} from '~/domain/utils/math.util';

import * as Public from '~/domain/models/public';
import * as Private from '~/domain/models/private';

import {ErrorCode} from '~/domain/errors';

//
// ROUND

export function getOrderSaleProjectRoundWhitelistStakeKeyHashes(
  round: Private.OrderSaleProjectRound
): string[] {
  return round.roundWhitelist.map(({walletStakeKeyHash}) => walletStakeKeyHash);
}

export function getProjectStatusRound(
  orderSaleProject: Private.OrderSaleProject,
  currentDate: Date = new Date()
): Private.OrderSaleProjectRound | undefined {
  return orderSaleProject.round.find(round => {
    const {startDate, endDate, isClosed, isSoldOut, priceUsd, priceLovelace} =
      round;

    const status = getProjectRoundStatus(
      currentDate,
      startDate,
      endDate,
      isClosed,
      isSoldOut,
      priceUsd,
      priceLovelace
    );

    return includes(
      [
        Private.OrderSaleProjectRoundStatus.ACTIVE,
        Private.OrderSaleProjectRoundStatus.UPCOMING,
      ],
      status
    );
  });
}

export function getProjectRoundInProject(
  orderSaleProject: Private.OrderSaleProject,
  roundId: string
): Private.OrderSaleProjectRound {
  const {round: rounds} = orderSaleProject;

  const projectRound = find(
    rounds,
    ({roundId: otherRoundId}) => otherRoundId === roundId
  );

  if (projectRound) return projectRound;
  else throw new Error(ErrorCode.ROUND_NOT_FOUND);
}

//
// FEE

export const calcTransactionFeeServiceAmount = (
  orderSaleData: Public.SaleOrderData,
  orderSaleProject: Private.OrderSaleProject,
  orderSaleProjectRound: Private.OrderSaleProjectRound
): string => {
  const {priceLovelace} = orderSaleProjectRound;

  return priceLovelace
    ? calcTransactionFeeServiceAmountForAGivenPrice(
        orderSaleData,
        orderSaleProject,
        orderSaleProjectRound,
        priceLovelace
      )
    : '0'; // If no price is set then return zero for service fee
};

function calcTransactionFeeServiceAmountForAGivenPrice(
  orderSaleData: Public.SaleOrderData,
  orderSaleProject: Private.OrderSaleProject,
  orderSaleDataProjectRound: Private.OrderSaleProjectRound,
  priceLovelace: bigint
) {
  const {baseAssetAmount} = orderSaleData;

  const quoteAssetAmount = times(Number(priceLovelace), baseAssetAmount);

  // compute order transaction fee amount (% of order amount in quote asset)
  const {feePercent: transactionFeeServicePercent} = orderSaleProject;

  const transactionFeeServiceAmount = times(
    quoteAssetAmount,
    transactionFeeServicePercent
  );

  return transactionFeeServiceAmount.toString();
}

//
// STATUS

export function getRoundStatus(
  round: Private.OrderSaleProjectRound
): Public.OrderSaleProjectRoundStatus {
  const {endDate, startDate} = round;
  const {isClosed, isSoldOut} = round;
  const {priceUsd, priceLovelace} = round;

  return getProjectRoundStatus(
    now(),
    startDate,
    endDate,
    isClosed,
    isSoldOut,
    priceUsd,
    priceLovelace
  );
}

export const getProjectRoundStatus = (
  now: Date,
  startDate: Date,
  endDate: Date,
  isClosed: boolean,
  isSoldOut: boolean,
  priceUsd: bigint | null,
  priceLovelace: bigint | null
): Public.OrderSaleProjectRoundStatus => {
  const isPriceUndefined = null === priceUsd || null === priceLovelace;

  if (isClosed) return 'CLOSED';
  if (isSoldOut) return 'CLOSED';
  if (isPriceUndefined) return 'UPCOMING';
  if (now > endDate) return 'CLOSED';
  if (now < startDate) return 'UPCOMING';

  return 'ACTIVE';
};
