#!/bin/sh
echo "======================================================"
echo " DEX DB - DAILY DEV SEED"
echo "======================================================"
echo " NODE_ENV         : ${NODE_ENV}"
echo " APP_PORT         : ${APP_PORT}"
echo " LOG_LEVEL        : ${LOG_LEVEL:=info}"
echo " TZ               : ${TZ}"
echo " DOCKER_CONTAINER : ${DOCKER_CONTAINER}"
echo " NAMESPACE        : ${K8S_NAMESPACE:=local}"
echo " user             : $(whoami)"
echo " pwd              : $(pwd)"
echo "======================================================"
echo " VERSION INFORMATION"
echo "======================================================"
echo " os version  : $(cat /etc/os-release | grep "PRETTY_NAME" | sed 's/PRETTY_NAME=//g' | sed 's/"//g')"
echo " yarn version: $(yarn --version)"
echo " npm version : $(npm --version)"
echo " node version: $(node --version)"
echo " CI_REVISION  : ${CI_REVISION:=?}"
echo " CI_BUILD_TIME: ${CI_BUILD_TIME:=?}"

# Stop the script on the first failure:
set -e

# Check if K8S_NAMESPACE is set to development or testnet
if [ "${K8S_NAMESPACE}" != "development" ] && [ "${K8S_NAMESPACE}" != "testnet" ]; then
  echo "Not in development or testnet environment -> Nothing to do."
  exit 0
fi

echo "======================================================"
echo " ARCHIVE DB SCHEMA"
echo "======================================================"
echo " > Renaming DB schema... "
set -x
yarn db-schema archive -s public
set +x
echo " [OK] Renaming DB schema: DONE. "

echo "======================================================"
echo " MIGRATE"
echo "======================================================"
echo " > Migrating new schema... "
set -x
yarn prisma migrate deploy
set +x
echo " [OK] Migrating DEV DB public schema: DONE. "

echo "======================================================"
echo " GRANT SEQUENCE PERMISSIONS"
echo "======================================================"
echo " > Granting sequence permissions... "
set -x
yarn db-schema grantSelectSequence -s public
set +x
echo " [OK] Granting permissions to read-only user on public schema: DONE. "

echo "======================================================"
echo " DEPLOY DEV SEED"
echo "======================================================"
echo " > Deploying DEV DB seed... "
set -x

# Common data
yarn seed commonGroup --network PREPROD

# Project data
yarn seed projectGroup --network PREPROD --project-name CRU
yarn seed projectGroup --network PREPROD --project-name GENS
yarn seed projectGroup --network PREPROD --project-name NMKR
yarn seed projectGroup --network PREPROD --project-name EMP
yarn seed projectGroup --network PREPROD --project-name NTX
yarn seed projectGroup --network PREPROD --project-name LENFI
yarn seed projectGroup --network PREPROD --project-name HOSKY
yarn seed projectGroup --network PREPROD --project-name CLAY
yarn seed projectGroup --network PREPROD --project-name AGIX
yarn seed projectGroup --network PREPROD --project-name iUSD
yarn seed projectGroup --network PREPROD --project-name MELD

# Order sale
yarn seed orderSaleGroup --network PREPROD --project-name CRU

# Vault staking
yarn seed stakingGroup --network PREPROD --project-name GENS
yarn seed stakingGroup --network PREPROD --project-name NMKR
yarn seed stakingGroup --network PREPROD --project-name EMP
yarn seed stakingGroup --network PREPROD --project-name NTX

# Liquidity pools
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol CRU-ADA
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol GENS-ADA
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol EMP-ADA
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol NTX-ADA
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol LENFI-ADA
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol HOSKY-ADA
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol CLAY-ADA
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol AGIX-ADA
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol iUSD-ADA
yarn seed tradingPairGroup --network PREPROD --trading-pair-symbol MELD-ADA

set +x
echo " [OK] Deploying DEV DB seed: DONE. "

echo "======================================================"
echo " SET ROUND PRICE"
echo "======================================================"
echo " > Setting round prices"
set -x
yarn cli:server set-round-price --round-code CRU/1 --price-usd 90 --price-lovelace 32000
set +x
echo " [OK] Setting DEV DB round prices: DONE. "

echo "======================================================"
echo " FINISHED!"
echo "======================================================"
