import {reduce} from 'lodash';

import * as Private from '~/domain/models/private';

import {
  isOrderSwapFinalFillOnChainSuccessEvent,
  isOrderSwapPartialFillOnChainSuccessEvent,
  OrderSwapEvent,
} from '~/domain/events';

export type OrderSwapEventWithFilledAmounts = OrderSwapEvent & {
  filledFromAssetAmount: string | null;
  filledToAssetAmount: string | null;
};

/**
 * @NOTE Function does not compensate for rollback events.
 * Ensure that only confirmed onchain events are included in onChainEvents
 * Exclude any onchain failures
 *
 * @NOTE Function assumes events are correctly ordered.
 * Ensure onChainEvents are sorted correctly by streamVersion.
 */
export const appendFilledAmountToFills =
  ({fromAssetAmount, toAssetAmount}: Private.OrderSwap) =>
  (onChainEvents: OrderSwapEvent[]): OrderSwapEventWithFilledAmounts[] =>
    reduce(
      onChainEvents,
      (
        {
          toAssetAmountRunningRemainder,
          fromAssetAmountRunningRemainder,
          events,
        },
        orderSwapEvent
      ) => {
        if (
          orderSwapEvent &&
          (isOrderSwapPartialFillOnChainSuccessEvent(orderSwapEvent) ||
            isOrderSwapFinalFillOnChainSuccessEvent(orderSwapEvent))
        ) {
          const {
            eventPayload: {
              toAssetAmountTotalRemaining,
              fromAssetAmountTotalRemaining,
            },
          } = orderSwapEvent;

          const filledFromAssetAmount = (
            BigInt(toAssetAmountRunningRemainder) -
            BigInt(toAssetAmountTotalRemaining)
          ).toString();
          const filledToAssetAmount = (
            BigInt(fromAssetAmountRunningRemainder) -
            BigInt(fromAssetAmountTotalRemaining)
          ).toString();

          const modifiedEvent = {
            ...orderSwapEvent,
            filledFromAssetAmount,
            filledToAssetAmount,
          };

          return {
            toAssetAmountRunningRemainder: BigInt(toAssetAmountTotalRemaining),
            fromAssetAmountRunningRemainder: BigInt(
              fromAssetAmountTotalRemaining
            ),
            events: [...events, modifiedEvent],
          };
        } else {
          const defaultEvent = {
            ...orderSwapEvent,
            filledFromAssetAmount: null,
            filledToAssetAmount: null,
          };
          return {
            toAssetAmountRunningRemainder,
            fromAssetAmountRunningRemainder,
            events: [...events, defaultEvent],
          };
        }
      },
      {
        toAssetAmountRunningRemainder: toAssetAmount,
        fromAssetAmountRunningRemainder: fromAssetAmount,
        events: [],
      } as {
        toAssetAmountRunningRemainder: bigint;
        fromAssetAmountRunningRemainder: bigint;
        events: OrderSwapEventWithFilledAmounts[];
      }
    ).events;
