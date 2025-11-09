#!/bin/bash

# Generate prisma client
yarn prisma generate

# Create and apply migrations
yarn prisma migrate dev --name unnamed

# ~~~ Description ~~~
# Below contain suitible test data for both DEX client and Launchpad clients.
# To speed up development you can remove projects from either ORDER_SALE or STAKING.
#
# Modify STAKING_GROUP_PROJECTS and ORDER_SALE_GROUP_PROJECTS based on what data
# you want provisioned.
#
# We use strings rather than arrays for compatibility with older version of bash.
# ~~~~~~~~~~~~~~~~~~~

# Variables
NETWORK=PREPROD

# See seed/data/stakingGroup for full list of options.
# Currently: CRU, NMKR, GENS, NTX
STAKING_GROUP_PROJECTS="CRU GENS"

# See seed/data/orderSaleGroup for full list of options.
# Currently: CRU, GENS, NINJAZ
ORDER_SALE_GROUP_PROJECTS="CRU GENS"

# See seed/data/tradingPairGroup for full list of options.
# Important: Must contain the sum of projects in the symbols, except for ADA.
TRADING_PAIR_GROUP_PROJECTS="CRU GENS"
TRADING_PAIR_GROUP_SYMBOLS="CRU-ADA GENS-ADA GENS-CRU"

# Create a union of staking and order sale groups
PROJECTS=$(echo "${STAKING_GROUP_PROJECTS} ${ORDER_SALE_GROUP_PROJECTS} ${TRADING_PAIR_GROUP_PROJECTS}" | tr ' ' '\n' | sort -u)

# Check if SEED_TARGET is empty and print a helper message if it is.
if [ -z "$SEED_TARGET" ]; then
  echo "\n"
  echo "############################################################################################"
  echo "Warning: The SEED_TARGET variable is not set. Defaulting to seed everything."
  echo "You can set the SEED_TARGET variable to control what to seed. Available options are:"
  echo "  - NONE: Do not seed anything."
  echo "  - STAKING: Only seed staking related data."
  echo "  - SALE: Only seed order sale related data."
  echo "  - SWAP: Only seed order swap related data."
  echo "############################################################################################"
  echo "\n"
fi

# This check passes if either SEED_TARGET is not set or if it is set to the
# target argument passed to this function.
shouldRun() {
  local target=$1
  [ -z "$SEED_TARGET" ] || [ "$SEED_TARGET" = "$target" ]
}

# Usage in the script
if [ "$SEED_TARGET" != "NONE" ]; then
  # Common data
  echo "[SEEDING] commonGroup"
  yarn seed commonGroup --network $NETWORK

  for PROJECT in $PROJECTS; do
    echo "[SEEDING] projectGroup $NETWORK $PROJECT"
    yarn seed projectGroup --network $NETWORK --project-name $PROJECT

    if shouldRun "STAKING"; then
      if echo "${STAKING_GROUP_PROJECTS}" | grep -q -w "$PROJECT"; then
        echo "[SEEDING] stakingGroup $NETWORK $PROJECT"
        yarn seed stakingGroup --network $NETWORK --project-name $PROJECT
      fi
    fi

    if shouldRun "SALE"; then
      echo "[SEEDING] devUser"
      yarn seed devUser

      if echo "${ORDER_SALE_GROUP_PROJECTS}" | grep -q -w "$PROJECT"; then
        echo "[SEEDING] orderSaleGroup $NETWORK $PROJECT"
        yarn seed orderSaleGroup --network $NETWORK --project-name $PROJECT
        echo "[SEEDING] set-round-price $PROJECT"
        yarn cli:server set-round-price --round-code "${PROJECT}/1" --price-usd 100 --price-lovelace 2300000
        yarn cli:server set-round-price --round-code "${PROJECT}/2" --price-usd 90 --price-lovelace 3400000
      fi
    fi
  done

  if shouldRun "SWAP"; then
    for SYMBOL in $TRADING_PAIR_GROUP_SYMBOLS; do
      echo "[SEEDING] tradingPairGroup $NETWORK $SYMBOL"
      yarn seed tradingPairGroup --network $NETWORK --trading-pair-symbol $SYMBOL
    done
  fi
fi

# Sleep (helpful for debugging `sleep infinity doesn't exist on Alpine 🙄`)
# while sleep 3600; do :; done

# Start server
yarn start:dev
