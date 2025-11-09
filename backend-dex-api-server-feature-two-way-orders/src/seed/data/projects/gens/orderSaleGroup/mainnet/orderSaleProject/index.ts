import {RoundSaleRule} from '~/domain/models/private';
import {map} from 'lodash';
import * as Seed from '~/seed/types';
import {getTotalAllocationAmount} from '~/seed/utils/order';
import {project as gensProjectMainnet} from '~/seed/data/projects/gens/projectGroup/mainnet/project';

// bech32 'addr1vy353yswsmluehajsmdx9n4dkdxvzcrrjpgpndkwfdxn5jqnfeq20';
const feeAddress = '612348920e86ffccdfb286da62ceadb34cc16063905019b6ce4b4d3a48';

// Created by Genius Yield MAINNET wallet
const sellerPublicKeyHashGens =
  '2348920e86ffccdfb286da62ceadb34cc16063905019b6ce4b4d3a48';

const createGensOrderSaleProject = (
  orderSaleProjectId: string,
  roundIds: string[]
): Seed.OrderSaleProject => {
  const round1: Seed.Round = {
    roundId: roundIds[0],
    number: 1,
    startDate: new Date('2022-12-05T13:00:00Z'),
    endDate: new Date('2022-12-09T13:00:00Z'),
    isClosed: false,
    isSoldOut: false,
    baseAssetSubmittedAmount: BigInt(0),
    quoteAssetRaisedAmount: BigInt(0),
    baseAssetAllocationAmount: BigInt(1_000_000_000_000),
    orderBaseAssetMinAllocation: BigInt(50_000_000),
    orderBaseAssetMaxAllocation: BigInt(10_000_000_000),
    saleRule: RoundSaleRule.PRIVATE_SALE_SINGLE_BUY,
    eligibilityDescription:
      'Available to Diamond Hands and Ape bonus rewards eligible delegators',
  };

  const round2: Seed.Round = {
    roundId: roundIds[1],
    number: 2,
    startDate: new Date('2022-12-09T13:00:00Z'),
    endDate: new Date('2022-12-13T13:00:00Z'),
    isClosed: false,
    isSoldOut: false,
    baseAssetSubmittedAmount: BigInt(0),
    quoteAssetRaisedAmount: BigInt(0),
    baseAssetAllocationAmount: BigInt(1_000_000_000_000),
    orderBaseAssetMinAllocation: BigInt(50_000_000),
    orderBaseAssetMaxAllocation: BigInt(10_000_000_000),
    saleRule: RoundSaleRule.PRIVATE_SALE_SINGLE_BUY,
    eligibilityDescription:
      'Available to Degen and HODLer bonus rewards eligible delegators',
  };

  const round3: Seed.Round = {
    roundId: roundIds[2],
    number: 3,
    startDate: new Date('2022-12-13T13:00:00Z'),
    endDate: new Date('2022-12-17T13:00:00Z'),
    isClosed: false,
    isSoldOut: false,
    baseAssetSubmittedAmount: BigInt(0),
    quoteAssetRaisedAmount: BigInt(0),
    baseAssetAllocationAmount: BigInt(1_000_000_000_000),
    orderBaseAssetMinAllocation: BigInt(50_000_000),
    orderBaseAssetMaxAllocation: BigInt(10_000_000_000),
    saleRule: RoundSaleRule.PRIVATE_SALE_SINGLE_BUY,
    eligibilityDescription:
      'Available to Shark and FOMO bonus rewards eligible delegators',
  };

  const round4: Seed.Round = {
    roundId: roundIds[3],
    number: 4,
    startDate: new Date('2022-12-17T15:00:00Z'),
    endDate: new Date('2022-12-21T13:00:00Z'),
    isClosed: false,
    isSoldOut: false,
    baseAssetSubmittedAmount: BigInt(0),
    quoteAssetRaisedAmount: BigInt(0),
    baseAssetAllocationAmount: BigInt(0),
    orderBaseAssetMinAllocation: BigInt(0),
    orderBaseAssetMaxAllocation: BigInt(10_000_000_000),
    saleRule: RoundSaleRule.PUBLIC_SALE_SINGLE_BUY,
    eligibilityDescription: 'Available to all eligible buyers who pass KYC!',
  };

  const rounds = [round1, round2, round3, round4];

  const gensOrderSaleProject: Seed.OrderSaleProject = {
    orderSaleProjectId,

    projectId: gensProjectMainnet.projectId,

    // set project distribution
    vestingPeriod: '100% TGE',
    distributionDate: new Date('2022-12-25T13:00:00Z'),
    distributionMethod: 'AIRDROP',

    // set project internal
    webEnabled: true,

    // set project fee, seller public key
    feePercent: 0,
    feeAddress: feeAddress,
    sellerPublicKeyHash: sellerPublicKeyHashGens,

    // Set funding method
    fundingMethod: 'Tokens',
    lockupPeriod: '10 days',

    // set project rounds
    baseAssetTotalTokenSupplyAmount: BigInt(100_000_000_000_000),
    baseAssetAllocationAmount: getTotalAllocationAmount(rounds),
    round: {
      connectOrCreate: map(rounds, round => ({
        where: {roundId: round.roundId},
        create: round,
      })),
    },
  };

  return gensOrderSaleProject;
};

export const orderSaleProject = createGensOrderSaleProject(
  '44324507-ab72-4d03-9c41-759c5ca29b9b',
  [
    'e710cb34-2d84-4d35-9168-bef53d328108',
    'efb10ed3-4f7a-4df1-893e-ff24b238a7e0',
    '42d35902-70b1-11ed-a1eb-0242ac120002',
    '5485d22e-70b1-11ed-a1eb-0242ac120002',
  ]
);
