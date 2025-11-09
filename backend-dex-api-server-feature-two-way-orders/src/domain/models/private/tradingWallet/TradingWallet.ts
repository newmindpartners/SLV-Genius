import {Prisma} from '@prisma/client';

export type TradingWallet = Prisma.TradingWalletGetPayload<{
  include: {
    tradingWalletUser: true;
    assetOne: true;
    assetTwo: true;
  };
}>;

export type TradingWalletCreate = Prisma.TradingWalletUncheckedCreateInput;

export type TradingWalletUpdate = Prisma.TradingWalletUncheckedUpdateInput;
