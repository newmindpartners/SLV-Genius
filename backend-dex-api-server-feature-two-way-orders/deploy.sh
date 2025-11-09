#!/bin/bash
#
# This simple script can be used to deploy to mainnet or preprod.
#
# Deployment can be done by setting a specfic git branch.
#
# Inputs:
#
# TARGET environment variable (optional string)
#
#    Tells the script to deploy to mainnet or preprod.
#
#    Valid values: mainnet or preprod.
#
#    Default value: mainnet
#
set -Eeuo pipefail

if [[ "${TARGET:=mainnet}" =~ ^mainnet|preprod$ ]]; then
  UPPER_TARGET=$(echo -n ${TARGET:=mainnet} | tr '[:lower:]' '[:upper:]')
else
  echo "Invalid TARGET value. Valid values are: mainnet and preprod."
  exit 1
fi
echo "======================================================"
echo " DEPLOY API SERVER TO $UPPER_TARGET"
echo "======================================================"
echo " Fetching commits from GitHub..."
git fetch origin main --quiet
git fetch origin $TARGET --quiet
echo " -> [OK] Remote revision information had been fetched."
echo "======================================================"
echo " CURRENTLY DEPLOYED TO $UPPER_TARGET"
echo "======================================================"
git log origin/${TARGET} -1
echo "======================================================"
echo " COMMIT TO BE DEPLOYED TO $UPPER_TARGET"
echo "======================================================"
git log origin/main -1
echo "======================================================"
echo
echo " This script is going to deploy the most recent commit"
echo " from the main branch to the $TARGET environment."
echo 
echo " >>> Deploy API SERVER to PRODUCTION ($UPPER_TARGET) <<<"
echo
echo " Are you sure? (type '${TARGET}' to proceed)"
echo
read -p  " > " -r
echo
if [[ "$REPLY" == "${TARGET}" ]]; then
  echo "======================================================"
  echo " Triggering deployment to ${TARGET}..."
  REMOTE_MAIN_HEAD=$(git rev-parse origin/main)
  git push --force origin ${REMOTE_MAIN_HEAD}:${TARGET} --quiet
  echo " [OK] Success!"
  echo "======================================================"
  echo " ✅ Deployment to $UPPER_TARGET triggered."
  echo "    Revision: ${REMOTE_MAIN_HEAD}"
  echo "======================================================"
  echo
  echo " -> Please be patient. "
  echo
  echo "    The deployment might take up to 10 minutes."
  echo
  echo "======================================================"
  echo " ✅ FINISED: Deployment triggered. "
  echo "======================================================"
else
  echo "======================================================"
  echo "Deployment has been cancelled by the user."
  echo "======================================================"
  echo " ❌ CANCELLED: Deployment cancelled. "
  echo "======================================================"
fi
