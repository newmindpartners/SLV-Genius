import 'reflect-metadata';
import {PrismaClient} from '@prisma/client';
import {container} from '~/cli/server/dependencyContext';
import {OrderSwapApplication} from '~/application/orderSwap.application';
import {getAdaGensMultiFillSelection} from './utils';

describe('Test different multi-fill strategies', () => {
  let prisma: PrismaClient;
  let orderSwapApplication: OrderSwapApplication;

  beforeAll(() => {
    prisma = container.resolve<PrismaClient>('PrismaClient');
    orderSwapApplication = container.resolve<OrderSwapApplication>(
      'OrderSwapApplication'
    );
  });

  /** orderSwapId                           baseAssetAmount  quoteAssetAmount  price
   *  9ff56075-2ec5-4a23-8927-fb946a6475ab  50,000,000       150,000,000       3.0
   *  3fd73424-cbae-4d5a-a50c-0db0bcde7366  200,000,000      100,000,000       0.5
   *  9c45f1d7-da9e-4f1e-b9af-5871d8c2516d  500,000,000      200,000,000       0.4
   *  389e62b2-08a7-4fea-b072-6adfa76a2cf0  1,000,000,000    300,000,000       0.3
   *  c581b933-84d9-4eef-94dd-e730a981cb0d  750,000,000      150,000,000       0.2
   *  be4a9ab7-f671-480d-b7c5-889f0d0a6fd9  400,000,000      80,000,000        0.2
   */
  it('Verifies multi-fill with strategy MULTI_FILL_POSTGRES_KNAPSACK', async () => {
    const filledOrderSwaps1 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      200 * 1_000_000,
      'MULTI_FILL_POSTGRES_KNAPSACK'
    );

    expect(filledOrderSwaps1).toEqual({
      results: [
        {
          orderSwapId: '9ff56075-2ec5-4a23-8927-fb946a6475ab',
          filledAmount: String(150 * 1_000_000),
        },
        {
          orderSwapId: '3fd73424-cbae-4d5a-a50c-0db0bcde7366',
          filledAmount: String(75 * 1_000_000),
        },
      ],
      alternativeResults: [],
    });

    const filledOrderSwaps2 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      201 * 1_000_000,
      'MULTI_FILL_POSTGRES_KNAPSACK'
    );

    expect(filledOrderSwaps2).toEqual({
      results: [
        {
          orderSwapId: '9ff56075-2ec5-4a23-8927-fb946a6475ab',
          filledAmount: String(150 * 1_000_000),
        },
        {
          orderSwapId: '3fd73424-cbae-4d5a-a50c-0db0bcde7366',
          filledAmount: String(75.5 * 1_000_000),
        },
      ],
      alternativeResults: [],
    });

    const filledOrderSwaps3 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      600 * 1_000_000,
      'MULTI_FILL_POSTGRES_KNAPSACK'
    );

    // TODO: Need to ignore order of objects
    // const sortByOrderSwapId = <T extends {orderSwapId: string}>(xs: T[]) =>
    //   xs.sort((a, b) => a.orderSwapId.localeCompare(b.orderSwapId));

    expect(filledOrderSwaps3).toEqual({
      results: [
        {
          orderSwapId: '9ff56075-2ec5-4a23-8927-fb946a6475ab',
          filledAmount: String(150 * 1_000_000),
        },
        {
          orderSwapId: '3fd73424-cbae-4d5a-a50c-0db0bcde7366',
          filledAmount: String(100 * 1_000_000),
        },
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(140 * 1_000_000),
        },
      ],
      alternativeResults: [],
    });

    const filledOrderSwaps4 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      601 * 1_000_000,
      'MULTI_FILL_POSTGRES_KNAPSACK'
    );

    expect(filledOrderSwaps4).toEqual({
      results: [
        {
          orderSwapId: '9ff56075-2ec5-4a23-8927-fb946a6475ab',
          filledAmount: String(150 * 1_000_000),
        },
        {
          orderSwapId: '3fd73424-cbae-4d5a-a50c-0db0bcde7366',
          filledAmount: String(100 * 1_000_000),
        },
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(140.4 * 1_000_000),
        },
      ],
      alternativeResults: [],
    });

    const filledOrderSwaps5 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      1700 * 1_000_000,
      'MULTI_FILL_POSTGRES_KNAPSACK'
    );

    expect(filledOrderSwaps5).toEqual({
      results: [
        {
          orderSwapId: '3fd73424-cbae-4d5a-a50c-0db0bcde7366',
          filledAmount: String(100 * 1_000_000),
        },
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(200 * 1_000_000),
        },
        {
          orderSwapId: '389e62b2-08a7-4fea-b072-6adfa76a2cf0',
          filledAmount: String(300 * 1_000_000),
        },
      ],
      alternativeResults: [
        {
          orderSwapId: '9ff56075-2ec5-4a23-8927-fb946a6475ab',
          filledAmount: String(150 * 1_000_000),
        },
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(200 * 1_000_000),
        },
        {
          orderSwapId: '389e62b2-08a7-4fea-b072-6adfa76a2cf0',
          filledAmount: String(300 * 1_000_000),
        },
      ],
    });

    const filledOrderSwaps6 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      1701 * 1_000_000,
      'MULTI_FILL_POSTGRES_KNAPSACK'
    );

    expect(filledOrderSwaps6).toEqual({
      results: [
        {
          orderSwapId: '9ff56075-2ec5-4a23-8927-fb946a6475ab',
          filledAmount: String(150 * 1_000_000),
        },
        {
          orderSwapId: '389e62b2-08a7-4fea-b072-6adfa76a2cf0',
          filledAmount: String(300 * 1_000_000),
        },
        {
          orderSwapId: 'c581b933-84d9-4eef-94dd-e730a981cb0d',
          filledAmount: String(130_200_000),
        },
      ],
      alternativeResults: [
        {
          orderSwapId: '9ff56075-2ec5-4a23-8927-fb946a6475ab',
          filledAmount: String(150 * 1_000_000),
        },
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(200 * 1_000_000),
        },
        {
          orderSwapId: '389e62b2-08a7-4fea-b072-6adfa76a2cf0',
          filledAmount: String(300 * 1_000_000),
        },
      ],
    });

    const filledOrderSwaps7 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      2250 * 1_000_000,
      'MULTI_FILL_POSTGRES_KNAPSACK'
    );

    expect(filledOrderSwaps7).toEqual({
      results: [
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(200 * 1_000_000),
        },
        {
          orderSwapId: '389e62b2-08a7-4fea-b072-6adfa76a2cf0',
          filledAmount: String(300 * 1_000_000),
        },
        {
          orderSwapId: 'c581b933-84d9-4eef-94dd-e730a981cb0d',
          filledAmount: String(150 * 1_000_000),
        },
      ],
      alternativeResults: [
        {
          orderSwapId: '9ff56075-2ec5-4a23-8927-fb946a6475ab',
          filledAmount: String(150 * 1_000_000),
        },
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(200 * 1_000_000),
        },
        {
          orderSwapId: '389e62b2-08a7-4fea-b072-6adfa76a2cf0',
          filledAmount: String(300 * 1_000_000),
        },
      ],
    });
  });

  it('Verifies multi-fill naive selection', async () => {
    const filledOrderSwaps1 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      200 * 1_000_000,
      'MULTI_FILL_NAIVE'
    );

    expect(filledOrderSwaps1).toEqual({
      results: [
        {
          orderSwapId: '3fd73424-cbae-4d5a-a50c-0db0bcde7366',
          filledAmount: String(100 * 1_000_000),
        },
      ],
      alternativeResults: [],
    });

    const filledOrderSwaps2 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      201 * 1_000_000,
      'MULTI_FILL_NAIVE'
    );

    expect(filledOrderSwaps2).toEqual({
      results: [
        {
          orderSwapId: '3fd73424-cbae-4d5a-a50c-0db0bcde7366',
          filledAmount: String(100 * 1_000_000),
        },
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(0.4 * 1_000_000),
        },
      ],
      alternativeResults: [],
    });

    const filledOrderSwaps3 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      600 * 1_000_000,
      'MULTI_FILL_NAIVE'
    );

    expect(filledOrderSwaps3).toEqual({
      results: [
        {
          orderSwapId: '3fd73424-cbae-4d5a-a50c-0db0bcde7366',
          filledAmount: String(100 * 1_000_000),
        },
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(160 * 1_000_000),
        },
      ],
      alternativeResults: [],
    });

    const filledOrderSwaps4 = await getAdaGensMultiFillSelection(
      prisma,
      orderSwapApplication,
      601 * 1_000_000,
      'MULTI_FILL_NAIVE'
    );

    expect(filledOrderSwaps4).toEqual({
      results: [
        {
          orderSwapId: '9c45f1d7-da9e-4f1e-b9af-5871d8c2516d',
          filledAmount: String(200 * 1_000_000),
        },
        {
          orderSwapId: '389e62b2-08a7-4fea-b072-6adfa76a2cf0',
          filledAmount: String(30.3 * 1_000_000),
        },
      ],
      alternativeResults: [],
    });
  });
});
