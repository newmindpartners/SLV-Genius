import 'reflect-metadata';

import {TransactionalContext} from '~/domain/context';

import * as Private from '~/domain/models/private';

export interface EventRepository {
  eventExistsByEventTypeAndId(
    context: TransactionalContext,
    eventId: string,
    eventType: Private.EventsType
  ): Promise<boolean>;
}
