import 'reflect-metadata';

import {injectable, singleton} from 'tsyringe';

import {Prisma} from '@prisma/client';
import * as Private from '~/domain/models/private';
import {TransactionalContext} from '~/domain/context';

import {EventRepository} from '~/domain/repositories';

@singleton()
@injectable()
export class EventRepositoryPrisma implements EventRepository {
  async eventExistsByEventTypeAndId(
    context: TransactionalContext,
    eventId: string,
    eventType: Private.EventsType
  ): Promise<boolean> {
    const eventCount = await this.getEventCount(context, eventType, eventId);

    return eventCount > 0;
  }

  private async getEventCount(
    prisma: Prisma.TransactionClient,
    eventType: Private.EventsType,
    eventId: string
  ): Promise<number> {
    switch (eventType) {
      case 'orderSaleEvent':
        return prisma.orderSaleEvent.count({
          where: {eventId: eventId},
        });
      case 'stakeVaultEvent':
        /**
         * TODO: Because we create CLAIM events before we submit transaction,
         * and once we submit transaction, we update these events, it's not possible
         * to create them using the transactionId.
         * Because of this, we cannot count stake vault events using this strategy
         * with the current model.
         */
        return 1;
      default:
        return 0;
    }
  }
}
