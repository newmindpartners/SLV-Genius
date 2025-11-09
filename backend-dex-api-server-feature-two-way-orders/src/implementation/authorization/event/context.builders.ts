import {container} from 'tsyringe';

import {FastifyRequest} from 'fastify';

import {TransactionalContext} from '~/domain/context';

import {ContextInput} from '../types';

import {PrismaClient} from '@prisma/client';
import * as Private from '~/domain/models/private';
import {SignedTransaction} from '~/domain/models/public';

import {EventRepository, EventStreamRepository} from '~/domain/repositories';

import {ErrorCode} from '~/domain/errors';
import {ApplicationError} from '~/application/application.error';

export interface EventExistsContext {
  isEventPresent: boolean;
}

export const isSignedTransactionRequest = (
  req: FastifyRequest
): req is FastifyRequest<{Body: SignedTransaction}> =>
  (req as FastifyRequest<{Body: SignedTransaction}>)?.body?.eventType !==
    undefined &&
  (req as FastifyRequest<{Body: SignedTransaction}>)?.body?.transactionId !==
    undefined &&
  (req as FastifyRequest<{Body: SignedTransaction}>)?.body
    ?.transactionSignature !== undefined;

/**
 * Performs data validation checks on incoming request and
 * Extracts request specific data before passing request agnostic data to context builder.
 */
export const entityEventExistsContextBuilderFactory = (req: FastifyRequest) => {
  if (isSignedTransactionRequest(req)) {
    const {eventType, transactionId: eventId} = req.body;
    return entityEventExistsContextBuilder(eventType, eventId);
  } else {
    throw new ApplicationError(
      ErrorCode.REQUEST_VALIDATION__MISSING_SIGNED_TRANSACTION
    );
  }
};

type EntityEventExistsHandler = (
  context: TransactionalContext,
  eventType: Private.EventsType,
  eventId: string
) => Promise<boolean>;

type EntityEventExistsHandlers = {
  [eventType in Private.EventsType]: EntityEventExistsHandler;
};

const eventExistsHandler = async (
  context: TransactionalContext,
  eventType: Private.EventsType,
  eventId: string
): Promise<boolean> => {
  const eventStreamRepository = container.resolve<EventStreamRepository>(
    'EventStreamRepository'
  );

  const isEventPresent = await eventStreamRepository.eventExistsByEventId(
    context,
    eventId
  );

  return isEventPresent;
};
// Special case in which we do not have an event for the entity type, so we return true.
const noOpEventExistsCheck = true;
const yieldFarmingEventExistsHandler = async (
  context: TransactionalContext,
  eventType: Private.EventsType,
  eventId: string
): Promise<boolean> => {
  return noOpEventExistsCheck;
};

const optionEventExistsHandler = async (
  context: TransactionalContext,
  eventType: Private.EventsType,
  eventId: string
): Promise<boolean> => {
  return noOpEventExistsCheck;
};

// This is a special case, as we are transitioning from an existing solution with separate event tables per entity.
// To distinguish the presence of events for a specific entity, an entity type (eventType) is required.
// This eventType drives the logic for checking event existence in the respective table.
const orderSaleOrStakeVaultEventExistsHandler = async (
  context: TransactionalContext,
  eventType: Private.EventsType,
  eventId: string
): Promise<boolean> => {
  const eventRepository = container.resolve<EventRepository>('EventRepository');

  const isEventPresent = await eventRepository.eventExistsByEventTypeAndId(
    context,
    eventId,
    eventType
  );

  return isEventPresent;
};

const entityEventExistsHandlers: EntityEventExistsHandlers = {
  orderSwapEvent: eventExistsHandler,
  orderSaleEvent: orderSaleOrStakeVaultEventExistsHandler,
  stakeVaultEvent: orderSaleOrStakeVaultEventExistsHandler,
  yieldFarmingEvent: yieldFarmingEventExistsHandler,
  optionEvent: optionEventExistsHandler,
  smartVaultEvent: eventExistsHandler,
  twoWayOrderEvent: async () => true,
};

/**
 * Checks that an event exists with provided event id.
 * This check is important to make sure we do not perform actions unless an event is present.
 *
 * For example, we do not want to pass a transaction submit request to the Tx server unless
 * such an event already exist in our DB.
 */
export const entityEventExistsContextBuilder =
  (eventType: Private.EventsType, eventId: string) =>
  async (context: ContextInput<object>): Promise<EventExistsContext> => {
    const prismaClient = container.resolve<PrismaClient>('PrismaClient');
    const entityEventExistsHandler = entityEventExistsHandlers[eventType];

    const isEventPresent = await entityEventExistsHandler(
      prismaClient,
      eventType,
      eventId
    );

    return {...(await context), isEventPresent};
  };
