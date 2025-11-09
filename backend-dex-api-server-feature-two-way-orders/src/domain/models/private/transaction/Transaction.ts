import {Prisma} from '@prisma/client';

export type TransactionFee = {
  transactionFeeAmount: string;
};

export type TransactionTimestamp = {
  transactionTimestamp: number;
};

export type Transaction = Prisma.TransactionGetPayload<{}>;

export type TransactionOutput = Prisma.TransactionOutputGetPayload<{}>;

export type TransactionWithInputsAndOutputs = Prisma.TransactionGetPayload<{
  include: {
    transactionInput: true;
    transactionOutput: true;
  };
}>;
