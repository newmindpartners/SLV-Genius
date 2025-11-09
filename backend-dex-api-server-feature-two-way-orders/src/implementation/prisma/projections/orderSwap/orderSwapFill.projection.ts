import {inject, injectable, singleton} from 'tsyringe';

import {
  EventStream,
  EventStreamProjection,
  OrderSwapEvent,
} from '~/domain/events';

import * as Prisma from '@prisma/client';

import {OrderSwapRepository} from '~/domain/repositories';

import {OrderSwapFillReducer} from '~/domain/events/reducer';

@singleton()
@injectable()
export class OrderSwapFillEventProjectionPrisma
  implements EventStreamProjection
{
  constructor(
    @inject('OrderSwapReducer')
    private readonly orderSwapReducer: OrderSwapFillReducer,

    @inject('OrderSwapFillReducer')
    private readonly orderSwapFillReducer: OrderSwapFillReducer,

    @inject('OrderSwapRepository')
    private readonly orderSwapRepository: OrderSwapRepository
  ) {}

  async handleWriteProjection(
    prisma: Prisma.Prisma.TransactionClient,
    event: OrderSwapEvent,
    eventStream: EventStream<OrderSwapEvent>
  ): Promise<void> {
    const orderSwapWithFills = this.orderSwapFillReducer.reduce(eventStream);

    await this.orderSwapRepository.createOrReplaceOrderSwapFills(
      prisma,
      orderSwapWithFills
    );
  }
}
