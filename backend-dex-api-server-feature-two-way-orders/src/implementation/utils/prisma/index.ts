import * as Prisma from '@prisma/client';

// P2025 - "An operation failed because it depends on one or more records that were required but not found. {cause}"
export const isRecordNotFound = (error: Error) =>
  error instanceof Prisma.Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2025';

// P2033 - "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers"
export const isBigIntOverflow = (error: Error) =>
  error instanceof Prisma.Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2033';

// P2002 - "Unique constraint failed on the {constraint}"
export const isUniqueConstraintViolation = (
  error: Error
): error is Prisma.Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002';
