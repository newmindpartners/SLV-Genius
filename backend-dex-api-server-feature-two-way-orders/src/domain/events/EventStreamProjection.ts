import {TransactionalContext} from '~/domain/context';

import {DomainEvent, EventStream} from '~/domain/events';

import {EventStreamRepository} from '~/domain/repositories';

export interface EventStreamProjection {
  handleWriteProjection(
    context: TransactionalContext,
    event: DomainEvent,
    eventStream: EventStream,
    eventStreamRepository: EventStreamRepository
  ): Promise<void>;
}
