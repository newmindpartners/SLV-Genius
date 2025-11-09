import {TransactionalContext} from '~/domain/context';

import {EventStream, DomainEvent} from '~/domain/events';

import {EventStreamRepository} from '~/domain/repositories';

export interface EventStreamListener {
  handleEventStreamMutation(
    context: TransactionalContext,
    event: DomainEvent,
    eventStream: EventStream,
    eventStreamRepository: EventStreamRepository
  ): Promise<void>;
}
