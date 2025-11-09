import {flatMap, values} from 'lodash';
import {
  stakingNftSubTypes,
  stakingNftTypes,
} from '~/domain/models/private/staking/StakingNft';

export type BlockchainParsingOutput = {
  type: string;
  subType: string;
  assetName: string;
  policyId: string;
};

export type Projects = keyof typeof stakingNftSubTypes;
export const projects = Object.keys(stakingNftSubTypes) as Projects[];

type StakingNftTypeByProject<Project = Projects> = Project extends Projects
  ? keyof (typeof stakingNftTypes)[Project]
  : never;

export type StakingNftType = StakingNftTypeByProject;

/* eslint-disable */
/**
 * TypeScript helpers for extracting nested types in object.
 * Taken from https://stackoverflow.com/questions/58014996/get-all-value-types-of-a-double-nested-object-in-typescript
 */
type DistributiveValues<T extends Record<string, any>> = T extends T
  ? T[keyof T]
  : never;
/* eslint-enable */

type InnerValues<
  T extends Record<keyof T, object>,
  K extends keyof T
> = DistributiveValues<T[K]>;

type SubTypesMap<T extends Record<string, object>> = InnerValues<T, keyof T>;

type stakingNftSubTypesMap = {
  [K in keyof typeof stakingNftSubTypes]: SubTypesMap<
    (typeof stakingNftSubTypes)[K]
  >;
};

export type StakingNftSubType<
  T extends keyof stakingNftSubTypesMap = keyof stakingNftSubTypesMap
> = stakingNftSubTypesMap[T];

/**
 * Below are helpers to make sure data parsed from the blockchain follow the expected
 * type and subTypes of our NFTs.
 */
export const isValidStakingNftType = (type: unknown): type is StakingNftType =>
  typeof type === 'string' && flatMap(stakingNftTypes, values).includes(type);

const validStakingNftSubTypes = flatMap(
  flatMap(stakingNftSubTypes, values),
  values
);

export const isValidStakingNftSubType = (
  subType: unknown
): subType is StakingNftSubType => validStakingNftSubTypes.includes(subType);
