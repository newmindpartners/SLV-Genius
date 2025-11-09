import * as Prisma from '@prisma/client';

export const EventTypes = Prisma.EventType;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];
