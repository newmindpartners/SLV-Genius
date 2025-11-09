#!/bin/bash
echo "======================================================"
echo " DEPLOY TESTNET TOKENS"
echo "======================================================"
if [[ "${K8S_NAMESPACE:=unkown}" =~ ^testnet$ ]]; then
  echo " Running in '${K8S_NAMESPACE}' namespace."
else
  echo "ERROR: Expected testnet namespce, but it is: '${K8S_NAMESPACE}'."
  exit 1
fi
echo "======================================================"
set -x
#############################################################
# DEPLOY TESTNET TOKENS:
echo "Nothing to do."
#############################################################
set +x
echo "======================================================"
echo " FINISHED."
echo "======================================================"
