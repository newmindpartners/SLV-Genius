import {flatten} from 'lodash';

import * as fs from 'fs';

import {CsvError, parse} from 'csv-parse';

import * as Prisma from '@prisma/client';
import {assetId} from '~/domain/utils/asset.util';

import {
  BlockchainParsingOutput,
  isValidStakingNftSubType,
  isValidStakingNftType,
} from '../types';

export type GenerateSqlParameters = {
  inputFile: string;
  outputFile: string;
};

export const generateStakingNftMintingDataSql = (
  parameters: GenerateSqlParameters
) => {
  const {inputFile, outputFile} = parameters;

  const inputFileContent = fs.readFileSync(inputFile);

  // input csv record columns
  const CsvColumns = ['type', 'subType', 'assetName', 'policyId'];

  parse(
    inputFileContent,
    {
      fromLine: 2,
      quote: '"',
      delimiter: ',',
      columns: CsvColumns,
    },
    (error: CsvError | undefined, records: BlockchainParsingOutput[]) => {
      if (error) throw Error;

      console.log(`Reading ${records.length} records from file ${inputFile}`);

      const isValidStakingNft = (record: BlockchainParsingOutput) => {
        if (
          isValidStakingNftType(record.type) &&
          isValidStakingNftSubType(record.subType)
        ) {
          return true;
        } else {
          console.warn(
            `Warning, validation failed for CSV record of type ${record.type}`
          );

          return false;
        }
      };

      const outputStakingNftMintingData: Prisma.Prisma.StakingNftMintingDataGetPayload<{}>[] =
        flatten(records.filter(isValidStakingNft)).map(record => ({
          assetId: assetId(record.policyId, record.assetName),
          policyId: record.policyId,
          assetName: record.assetName,
          stakingNftType: record.type,
          stakingNftSubType: record.subType,
          utilityDurationSeconds: 0,
          created: new Date(),
          updated: new Date(),
        }));

      const insertStakingNftMintingDataSql = outputStakingNftMintingData.map(
        ({assetId, policyId, assetName, stakingNftType, stakingNftSubType}) =>
          'INSERT INTO STAKING_NFT_MINTING_DATA ' +
          '(asset_id, policy_id, asset_name, staking_nft_type, staking_nft_sub_type) ' +
          'VALUES (' +
          `'${assetId}', ` +
          `'${policyId}', ` +
          `'${assetName}', ` +
          `'${stakingNftType}', ` +
          `'${stakingNftSubType}');`
      );

      fs.truncate(outputFile, () => {});

      console.log(
        `Writing ${insertStakingNftMintingDataSql.length} SQL insert statements into file ${outputFile}`
      );

      insertStakingNftMintingDataSql.forEach(sqlInsertion =>
        fs.appendFile(outputFile, `${sqlInsertion}\n`, () => {})
      );
    }
  );
};
