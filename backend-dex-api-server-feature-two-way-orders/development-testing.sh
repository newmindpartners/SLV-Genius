#!/bin/bash

# Generate prisma client
yarn prisma generate

# Create and apply migrations
yarn prisma migrate dev --name unnamed

# Variables
NETWORK=PREPROD

if [ "$SEED_TARGET" != "NONE" ]; then

  yarn seed commonGroup --network $NETWORK
  yarn seed projectGroup --network $NETWORK --project-name "GENS"
  yarn seed tradingPairGroup --network $NETWORK --trading-pair-symbol "GENS-ADA"
  yarn seed devOrderSwaps

fi

# Run integration tests
yarn test test/implementation/application/orderSwap/multiFill.test.ts

while sleep infinity; do :; done
