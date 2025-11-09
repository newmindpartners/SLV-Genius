import {RoundSaleRule} from '~/domain/models/private';
import {map} from 'lodash';
import {whitelistedStakeKeyHashes} from './walletWhitelist';
import {secondsFromNow} from '~/domain/utils/date.util';
import * as Seed from '~/seed/types';
import {assets as cruPreprodAssets} from '~/seed/data/projects/cru/projectGroup/preprod/asset';
import {project as cruPreprodProject} from '~/seed/data/projects/cru/projectGroup/preprod/project';
import {
  createRound,
  getTotalAllocationAmount,
  prepareRoundWhitelist,
} from '~/seed/utils/order';

const feeAddress =
  '00dfafbb2134840aa9f91e6764348d7d9b5e0b243b37efbd2eb24dc6f5b98d41fa032cda9644cddfe39a0ed0eb905e96a546ddd8e854719c27';

// Created by Genius Yield preprod wallet
const sellerPublicKeyHashCru =
  '25195af85c41b9d97da7f4f215d3e74c9cef7f04739d6ba473ba72a2';

export const preparedRoundWhitelist: Seed.RoundWhitelist[] =
  prepareRoundWhitelist(whitelistedStakeKeyHashes);

const createCruProject = (
  orderSaleProjectId: string,
  roundIds: string[]
): Seed.OrderSaleProject => {
  const rounds = [
    createRound(cruPreprodAssets.cru, {
      roundId: roundIds[0],
      number: 1,
      startDate: secondsFromNow(0 * 60),
      endDate: secondsFromNow(20 * 60),
      isClosed: false,
      isSoldOut: false,
      orderBaseAssetMinAllocation: BigInt(10_000_000),
      orderBaseAssetMaxAllocation: BigInt(10_000_000_000),
      baseAssetSubmittedAmount: BigInt(0),
      baseAssetAllocationAmount: BigInt(5_000_000_000),
      saleRule: RoundSaleRule.PUBLIC_SALE_MULTI_BUY,
      eligibilityDescription: 'Available to whitelisted users',
    }),
  ];

  const project: Seed.OrderSaleProject = {
    orderSaleProjectId,

    projectId: cruPreprodProject.projectId,

    // set project distribution
    vestingPeriod: '100% TGE',
    // ensure date is later than last round end
    distributionDate: secondsFromNow(30 * 60),
    distributionMethod: 'AIRDROP',

    // set project internals
    webEnabled: true,

    // set project fee, seller public key
    feePercent: 0,
    feeAddress: feeAddress,
    sellerPublicKeyHash: sellerPublicKeyHashCru,

    // Set funding method
    fundingMethod: 'Tokens',
    lockupPeriod: '10 days',

    // set project rounds
    baseAssetTotalTokenSupplyAmount: BigInt(500_000_000_000_000),
    baseAssetAllocationAmount: getTotalAllocationAmount(rounds),
    round: {
      connectOrCreate: map(rounds, round => ({
        where: {roundId: round.roundId},
        create: round,
      })),
    },
  };

  return project;
};

export const orderSaleProject = createCruProject(
  '1917cf40-f93c-11ec-b939-0242ac120002',
  ['df804411-d6d3-43b1-93e0-5a2f6625ac1b']
);
