import {map} from 'lodash';

import {ErrorCode} from '~/domain/errors';

import {
  DomainEvent,
  EventStream,
  EventStreamListener,
  EventType,
  EventStreamProjection,
} from '~/domain/events';

import {TransactionalContext} from '~/domain/context';

import {LoggerService} from '~/domain/services';
import {EventStreamRepository} from '~/domain/repositories';

import {isError} from '~/implementation/utils/typescript';
import {ProjectionError} from '~/implementation/prisma/projections/projection.error';

export abstract class AbstractEventStreamListener
  implements EventStreamListener
{
  protected constructor(
    readonly loggerService: LoggerService,
    protected readonly eventTypesProjections: Record<
      EventType,
      /**
       * These projections are persisted sequentially, and therefore the order
       * in which they are defined matters.
       *
       * This is useful when, for example, projections A and B are persisted
       * by the same event (i.e. same Prisma transaction) and B needs to have
       * a foreign key relation to entity A. Without this sequential guarantee,
       * there could arise race conditions where B is persisted before A and
       * referencing A would not be possible.
       */
      EventStreamProjection[]
    >
  ) {}

  async handleEventStreamMutation(
    context: TransactionalContext,
    event: DomainEvent,
    eventStream: EventStream,
    eventStreamRepository: EventStreamRepository
  ): Promise<void> {
    try {
      const {eventType} = event;

      const eventTypeProjections = this.eventTypesProjections[eventType];

      const tasks: (() => Promise<void>)[] = map(
        eventTypeProjections,
        domainEventProjection => () =>
          domainEventProjection.handleWriteProjection(
            context,
            event,
            eventStream,
            eventStreamRepository
          )
      );

      /**
       * Persist the projections sequentially to allow the projections to
       * depend on each other.
       */
      for (const task of tasks) {
        await task();
      }
    } catch (error) {
      if (isError(error)) {
        this.loggerService.error(error, error.message, {event, eventStream});

        throw new ProjectionError(
          ErrorCode.PROJECTION__CRITICAL_FAILED_TO_PROJECT,
          event,
          error
        );
      } else throw error;
    }
  }
}
