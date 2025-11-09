import {RoundSaleRule} from '~/domain/models/private';
import {map} from 'lodash';
import {secondsFromNow} from '~/domain/utils/date.util';
import * as Seed from '~/seed/types';
import {assets as cgvPreprodAsset} from '~/seed/data/projects/cgv/projectGroup/preprod/asset';
import {project as cgvProject} from '~/seed/data/projects/cgv/projectGroup/preprod/project';
import {createRound, getTotalAllocationAmount} from '~/seed/utils/order';

const feeAddress =
  '00dfafbb2134840aa9f91e6764348d7d9b5e0b243b37efbd2eb24dc6f5b98d41fa032cda9644cddfe39a0ed0eb905e96a546ddd8e854719c27';

// Created by Genius Yield preprod wallet
const sellerPublicKeyHashCgv =
  '25195af85c41b9d97da7f4f215d3e74c9cef7f04739d6ba473ba72a2';

const createCgvProject = (
  orderSaleProjectId: string,
  roundIds: string[]
): Seed.OrderSaleProject => {
  const rounds = [
    createRound(cgvPreprodAsset.cgv, {
      roundId: roundIds[0],
      number: 1,
      startDate: secondsFromNow(60 * 10),
      endDate: secondsFromNow(60 * 60),
      isClosed: false,
      isSoldOut: false,
      orderBaseAssetMinAllocation: BigInt(1_250_000_000),
      orderBaseAssetMaxAllocation: BigInt(625_000_000_000),
      baseAssetSubmittedAmount: BigInt(0),
      baseAssetAllocationAmount: BigInt(8_750_000_000_000),
      saleRule: RoundSaleRule.PUBLIC_SALE_MULTI_BUY,
      eligibilityDescription: 'Available to all eligible buyers who pass KYC!',
    }),
  ];

  const project: Seed.OrderSaleProject = {
    orderSaleProjectId,

    projectId: cgvProject.projectId,

    // set project distribution
    vestingPeriod:
      '15% initial unlock, 3 months cliff, 18 months linear vesting',
    // ensure date is later than last round end
    distributionDate: secondsFromNow(60 * 60 * 12),
    distributionMethod: 'AIRDROP',

    // set project internals
    webEnabled: true,

    // set project fee, seller public key
    feePercent: 0,
    feeAddress: feeAddress,
    sellerPublicKeyHash: sellerPublicKeyHashCgv,

    // Set funding method
    fundingMethod: 'Tokens',
    lockupPeriod: '18 months linear release',

    // set project rounds
    baseAssetTotalTokenSupplyAmount: BigInt(1_000_000_000_000_000),
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

export const orderSaleProject = createCgvProject(
  'd3d086ac-ecd2-489d-9060-c5ba23e37057',
  ['cf71d544-587a-44e2-be81-57af91efcbcc']
);
