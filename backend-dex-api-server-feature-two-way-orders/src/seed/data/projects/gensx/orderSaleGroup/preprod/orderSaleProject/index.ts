import {RoundSaleRule} from '~/domain/models/private';
import {map} from 'lodash';
import {secondsFromNow} from '~/domain/utils/date.util';
import * as Seed from '~/seed/types';
import {assets as gensxPreprodAsset} from '~/seed/data/projects/gensx/projectGroup/preprod/asset';
import {project as gensxPreprodProject} from '~/seed/data/projects/gensx/projectGroup/preprod/project';
import {createRound, getTotalAllocationAmount} from '~/seed/utils/order';

const feeAddress =
  '00dfafbb2134840aa9f91e6764348d7d9b5e0b243b37efbd2eb24dc6f5b98d41fa032cda9644cddfe39a0ed0eb905e96a546ddd8e854719c27';

// Used the same wallet from Gens Mainnet needs to be double checked
const sellerPublicKeyHashGensx =
  '25195af85c41b9d97da7f4f215d3e74c9cef7f04739d6ba473ba72a2';

const createGensxProject = (
  orderSaleProjectId: string,
  roundIds: string[]
): Seed.OrderSaleProject => {
  const rounds = [
    createRound(gensxPreprodAsset.gensx, {
      roundId: roundIds[0],
      number: 1,
      startDate: secondsFromNow(60 * 15),
      endDate: secondsFromNow(60 * 60 * 4),
      isClosed: false,
      isSoldOut: false,
      orderBaseAssetMinAllocation: BigInt(5_555_000_000),
      orderBaseAssetMaxAllocation: BigInt(5_555_555_000_000),
      baseAssetSubmittedAmount: BigInt(0),
      baseAssetAllocationAmount: BigInt(19_444_440_000_000),
      saleRule: RoundSaleRule.PUBLIC_SALE_MULTI_BUY,
      eligibilityDescription: 'Available to all eligible buyers who pass KYC!',
    }),
  ];

  const project: Seed.OrderSaleProject = {
    orderSaleProjectId,

    projectId: gensxPreprodProject.projectId,

    // set project distribution
    vestingPeriod: '20% initial unlock then 12-month linear vesting',
    // ensure date is later than last round end
    distributionDate: secondsFromNow(60 * 60 * 16),
    distributionMethod: 'AIRDROP',

    // set project internals
    webEnabled: true,

    // set project fee, seller public key
    feePercent: 0,
    feeAddress: feeAddress,
    sellerPublicKeyHash: sellerPublicKeyHashGensx,

    // Set funding method
    fundingMethod: 'Tokens',
    lockupPeriod: '12-month linear release',

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

export const orderSaleProject = createGensxProject(
  '015de1c2-f57a-4d27-9e87-63173c2ccc80',
  ['8e47fe38-b9bf-416d-9a6d-4dc4596952db']
);
