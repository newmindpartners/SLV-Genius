#!/bin/bash
echo "======================================================"
echo " DEPLOY DEVELOPMENT TOKENS"
echo "======================================================"
if [[ "${K8S_NAMESPACE:=unkown}" =~ ^development$ ]]; then
  echo " Running in '${K8S_NAMESPACE}' namespace."
else
  echo "ERROR: Expected development namespce, but it is: '${K8S_NAMESPACE}'."
  exit 1
fi
echo "======================================================"
set -x
#############################################################
# DEPLOY DEVELOPMENT TOKENS:
echo "Nothing to do."
#############################################################
set +x
echo "======================================================"
echo " FINISHED."
echo "======================================================"
