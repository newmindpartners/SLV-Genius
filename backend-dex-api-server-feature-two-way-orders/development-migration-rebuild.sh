#!/bin/sh
# preprod-migration-rebuild.sh

# Check if K8S_NAMESPACE is set to development
if [ "${K8S_NAMESPACE}" != "development" ]; then
  echo "Not in development environment -> Nothing to do."
  exit 0
fi

echo "======================================================"
echo " DEV Generate Migrations And Rebuild Order-Swap"
echo "======================================================"
echo " > Generating and applying Prisma migrations... "
set -x
yarn prisma migrate dev --name unnamed_migrations
set +x

echo " > Running orderSwap projection rebuild... "
set -x
yarn cli:server order-swap --rebuild-all
set +x

echo "======================================================"
echo " Finished Migrations And Rebuild"
echo "======================================================"
