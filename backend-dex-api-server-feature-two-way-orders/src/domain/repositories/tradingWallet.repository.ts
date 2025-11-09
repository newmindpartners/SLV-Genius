import 'reflect-metadata';

import * as Prisma from '@prisma/client';
import * as Private from '~/domain/models/private';

export interface TradingWalletRepository {
  listTradingWallets(
    prisma: Prisma.Prisma.TransactionClient,
    query?: Private.TradingWalletListQuery
  ): Promise<Private.PaginatedResults<Private.TradingWallet>>;

  getTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    query?: Private.TradingWalletQuery
  ): Promise<Private.TradingWallet>;

  getOrCreateTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    tradingWalletData: Private.TradingWalletCreate
  ): Promise<Private.TradingWallet>;

  createTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    tradingWalletData: Private.TradingWalletCreate
  ): Promise<Private.TradingWallet>;

  followTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    userId: string,
    tradingWalletId: string
  ): Promise<void>;

  updateTradingWallet(
    prisma: Prisma.Prisma.TransactionClient,
    tradingWalletId: string,
    tradingWalletUpdate: Private.TradingWalletUpdate
  ): Promise<Private.TradingWallet>;
}
