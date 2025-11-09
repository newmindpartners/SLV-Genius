#!/bin/bash
echo "======================================================"
echo " DEPLOY MAINNET TOKENS"
echo "======================================================"
if [[ "${K8S_NAMESPACE:=unkown}" =~ ^mainnet$ ]]; then
  echo " Running in '${K8S_NAMESPACE}' namespace."
else
  echo "ERROR: Expected mainnet namespce, but it is: '${K8S_NAMESPACE}'."
  exit 1
fi
echo "======================================================"
set -x
#############################################################
# DEPLOY MAINNET TOKENS:
echo "Nothing to do."
#############################################################
set +x
echo "======================================================"
echo " FINISHED."
echo "======================================================"
