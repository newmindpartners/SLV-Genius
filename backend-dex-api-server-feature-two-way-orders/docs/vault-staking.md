# Staking NFT representation in DB and on-chain

## Mint NFTs on preprod

See [this issue](https://github.com/geniusyield/dex-api-server/issues/2308) on how to create NFTs on-chain in preprod, and populate them in our API server DB.

## Create Sql Insert Script for ISPO vesting rewards into table `StakingAssetVesting`

```
yarn cli:dev staking-asset-vesting-sql \
  --asset-id asset1266q2ewhgul7jh3xqpvjzqarrepfjuler20akr \
  --input-file gens-ispo-rewards.csv \
  --output-file staking-asset-vesting-gens.sql
```

## Create Sql Insert Script for mainnet NFT data into table `StakingNftMintingData`

First generate a CSV file containing the required data of all mainnet NFT's by running. Note that this will take about 10k of your BlockFrost request quota and expect it to take up to 15 minutes to finish.

```shell
yarn cli:dev staking-parse-blockfrost-nft-data \
  --output-file mainnet-nft-data.csv \
  --blockfrost-api-key <MAINNET_TOKEN>
```

Once this is done, parse this file and construct SQL insert statements.

```
yarn cli:dev staking-nft-minting-data-sql \
  --input-file mainnet-nft-data.csv \
  --output-file staking-nft-minting-data.sql
```
