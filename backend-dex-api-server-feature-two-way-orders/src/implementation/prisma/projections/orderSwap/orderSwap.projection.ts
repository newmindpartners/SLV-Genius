import {inject, injectable, singleton} from 'tsyringe';

import {
  OrderSwapEvent,
  EventStream,
  EventStreamProjection,
} from '~/domain/events';

import * as Prisma from '@prisma/client';

import {OrderSwapReducer} from '~/domain/events/reducer';

import {OrderSwapRepository} from '~/domain/repositories';

@singleton()
@injectable()
export class OrderSwapEventProjectionPrisma implements EventStreamProjection {
  constructor(
    @inject('OrderSwapReducer')
    private readonly orderSwapReducer: OrderSwapReducer,

    @inject('OrderSwapRepository')
    private readonly orderSwapRepository: OrderSwapRepository
  ) {}

  async handleWriteProjection(
    prisma: Prisma.Prisma.TransactionClient,
    event: OrderSwapEvent,
    eventStream: EventStream<OrderSwapEvent>
  ): Promise<void> {
    await this.orderSwapRepository.createOrUpdateOrderSwap(
      prisma,
      this.orderSwapReducer.reduce(eventStream)
    );
  }
}
