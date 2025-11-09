// eslint-disable-next-line node/no-unpublished-import
import {createObjectCsvWriter} from 'csv-writer';
// eslint-disable-next-line node/no-unpublished-import
import {BlockFrostAPI} from '@blockfrost/blockfrost-js';
// eslint-disable-next-line node/no-unpublished-import
import {PaginationOptions} from '@blockfrost/blockfrost-js/lib/types';
import {
  AssetWithAssetName,
  getMintingDataSubType,
  getNftMintingDataInstructions,
} from '../projects';
import {BlockchainParsingOutput, Projects, StakingNftType} from '../types';
import {CardanoNetwork} from '~/domain/models/cardano';

type API = InstanceType<typeof BlockFrostAPI>;

type BlockfrostAssetIdentifiers = Awaited<ReturnType<API['assetsPolicyById']>>;
type BlockfrostAsset = Awaited<ReturnType<API['assetsById']>>;

export type BlockchainParsingParameters = {
  network: CardanoNetwork;
  projectName: Projects;
  outputFile: string;
  blockfrostAccessToken: string;
};

const getAllBlockfrostAssetIdentifiers = async (
  acc: BlockfrostAssetIdentifiers,
  req: (page: number) => Promise<BlockfrostAssetIdentifiers>,
  page: number
): Promise<BlockfrostAssetIdentifiers> => {
  const nextAssets = await req(page);
  if (nextAssets.length === 100) {
    return getAllBlockfrostAssetIdentifiers(
      [...acc, ...nextAssets],
      req,
      page + 1
    );
  } else {
    return Promise.resolve([...acc, ...nextAssets]);
  }
};

const getAssetsByPolicyId = async (api: API, policyId: string) => {
  const paginationOptions: PaginationOptions = {
    count: 100,
  };

  const getAssetIdentifiers = (
    page: number
  ): Promise<BlockfrostAssetIdentifiers> =>
    api.assetsPolicyById(policyId, {...paginationOptions, page});

  const assetIdentifiers = await getAllBlockfrostAssetIdentifiers(
    [],
    getAssetIdentifiers,
    1
  );

  console.log(
    `Found ${assetIdentifiers.length} assets with policyId ${policyId}`
  );
  console.log('Fetching additional asset data for each one, be patient...');

  const assets = await Promise.all(
    assetIdentifiers.map(({asset}) => api.assetsById(asset))
  );

  return assets;
};

export const parseBlockfrostForNftMintingData = async ({
  network,
  projectName,
  outputFile,
  blockfrostAccessToken,
}: BlockchainParsingParameters) => {
  const api = new BlockFrostAPI({
    projectId: blockfrostAccessToken,
  });

  type Input = {
    policyId: string;
    type: StakingNftType;
  };

  const csvWriter = createObjectCsvWriter({
    path: outputFile,
    header: [
      {id: 'type', title: 'type'},
      {id: 'subType', title: 'subType'},
      {id: 'assetName', title: 'assetName'},
      {id: 'policyId', title: 'policyId'},
    ],
  });

  const writeNftMintingData = async ({policyId, type}: Input) => {
    const blockfrostAssets: BlockfrostAsset[] = await getAssetsByPolicyId(
      api,
      policyId
    );

    const blockfrostNft: BlockchainParsingOutput[] = blockfrostAssets
      .filter(
        (asset): asset is AssetWithAssetName =>
          typeof asset.asset_name === 'string'
      )
      .map(blockfrostAsset => {
        const subType = getMintingDataSubType(
          projectName,
          type,
          blockfrostAsset
        );

        if (!subType) {
          console.warn(
            `Could not determine 'subType' for projectName: ${projectName} type: ${type}`
          );
        }

        const mintingData: BlockchainParsingOutput | null = subType
          ? {
              type,
              subType,
              assetName: blockfrostAsset.asset_name,
              policyId: blockfrostAsset.policy_id,
            }
          : null;

        return mintingData;
      })
      .filter(
        (mintingData): mintingData is BlockchainParsingOutput =>
          mintingData !== null
      );

    csvWriter.writeRecords(blockfrostNft).then(() => {
      console.log(
        `Writing ${blockfrostNft.length} records for policyId ${policyId} and type ${type} ` +
          `based on ${blockfrostAssets.length} assets`
      );
    });
  };

  const nftMintingDataInstructions = getNftMintingDataInstructions(
    network,
    projectName
  );

  for (const instruction of nftMintingDataInstructions) {
    await writeNftMintingData(instruction);
  }
};
