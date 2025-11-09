#!/bin/bash

usage() {
    cat << EOF

Exports NFT minting data to an output file.

Usage: $(basename "${BASH_SOURCE[0]}") {MAINNET|PREPROD} {GENS|CRU|NMKR|...}

Example: ./staking-nft-minting-data.sh PREPROD GENS

Please make sure that following dependencies are installed:
  - docker-compose
  - psql

EOF
    exit
}

if [ "$#" -ne 2 ]; then
    usage
fi

NETWORK="$1"
PROJECT_NAME="$2"

BLOCKFROST_OUTPUT="temp-blockfrost-output.csv"

docker-compose exec dex-api yarn cli:tools staking-parse-blockfrost-nft-data \
    --network "${NETWORK}" \
    --project-name "${PROJECT_NAME}" \
    --output-file $BLOCKFROST_OUTPUT

MINTING_DATA_OUTPUT="staking-nft-minting-data.sql"

docker-compose exec dex-api yarn cli:tools staking-nft-minting-data-sql \
    --input-file $BLOCKFROST_OUTPUT \
    --output-file $MINTING_DATA_OUTPUT

psql -h localhost -p 5432 -U postgres \
    -d dex-server-db \
    -f $MINTING_DATA_OUTPUT

rm $BLOCKFROST_OUTPUT $MINTING_DATA_OUTPUT
