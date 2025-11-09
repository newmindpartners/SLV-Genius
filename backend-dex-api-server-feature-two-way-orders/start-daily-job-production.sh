#!/bin/sh
echo "======================================================"
echo " DAILY CRON JOB"
echo "======================================================"
echo " NODE_ENV         : ${NODE_ENV}"
echo " APP_PORT         : ${APP_PORT}"
echo " LOG_LEVEL        : ${LOG_LEVEL:=info}"
echo " TZ               : ${TZ}"
echo " DOCKER_CONTAINER : ${DOCKER_CONTAINER}"
echo " user             : $(whoami)"
echo " pwd              : $(pwd)"
echo " WINDOW_INTERVAL  : ${WINDOW_INTERVAL:=3mo}"
echo " BIN_INTERVAL     : ${BIN_INTERVAL:=1w}"
echo " BATCH_SIZE       : ${BATCH_SIZE:=10}"
echo "======================================================"
echo " VERSION INFORMATION"
echo "======================================================"
echo " os version   : $(cat /etc/os-release | grep "PRETTY_NAME" | sed 's/PRETTY_NAME=//g' | sed 's/"//g')"
echo " yarn version : $(yarn --version)"
echo " npm version  : $(npm --version)"
echo " node version : $(node --version)"
echo " CI_BUILD_URL : ${CI_BUILD_URL:=?}"
echo " CI_REVISION  : ${CI_REVISION:=?}"
echo " CI_BUILD_TIME: ${CI_BUILD_TIME:=?}"
echo "======================================================"
echo " BROADCAST STARTUP EVENT "
echo "======================================================"
echo " Publishing to Discord... "
DISCORD_USERNAME="[${K8S_NAMESPACE:-UNKNOWN_NS}] ${K8S_POD_NAME:-UNKNOWN_POD} @ $(date -u +"%Y-%m-%d %T [%Z]")"
DISCORD_MESSAGE=" Running daily cron job... 🤖 ⚙️  \nCI_REVISION: $CI_REPO_URL/commits/${CI_REVISION:=?}\nCI_BUILD_TIME: ${CI_BUILD_TIME:=?}\nCI_BUILD: ${CI_BUILD_URL}\nWINDOW_INTERVAL: ${WINDOW_INTERVAL}\nBIN_INTERVAL: ${BIN_INTERVAL}\nBATCH_SIZE: ${BATCH_SIZE} "
curl -s -w "HTTP RESPONSE STATUS CODE: %{http_code}\n" --header "Content-Type: application/json" --request POST --data "{\"content\":\"${DISCORD_MESSAGE}\", \"username\": \"${DISCORD_USERNAME}\", \"avatar_url\": \"${DISCORD_AVATAR_URL:-https://raw.githubusercontent.com/4TT1L4/images/main/q.png}\"}" https://discord.com/api/webhooks/1040305944132845659/IXmfhkk0JDEti43rQuAx99L4my6yVxtG1Hna3yxiNeyAQGmfQpnShy08ifLFc3lSzJQM
curl -s -w "HTTP RESPONSE STATUS CODE: %{http_code}\n" --header "Content-Type: application/json" --request POST --data "{\"content\":\"${DISCORD_MESSAGE}\", \"username\": \"${DISCORD_USERNAME}\", \"avatar_url\": \"${DISCORD_AVATAR_URL:-https://raw.githubusercontent.com/4TT1L4/images/main/q.png}\"}" $DISCORD_WEBHOOK
curl -s -w "HTTP RESPONSE STATUS CODE: %{http_code}\n" --header "Content-Type: application/json" --request POST --data "{\"content\":\"${DISCORD_MESSAGE}\", \"username\": \"${DISCORD_USERNAME}\", \"avatar_url\": \"${DISCORD_AVATAR_URL:-https://raw.githubusercontent.com/4TT1L4/images/main/q.png}\"}" $DISCORD_WEBHOOK?thread_id=$DISCORD_THREAD_ID
echo " [OK] Done. Startup event has been sent to Discord."

echo "======================================================"
echo " > Running daily cron job... 🚀 "
set -x
yarn cli:server batch-update-all-trading-wallet-profitability-metrics --window-interval ${WINDOW_INTERVAL} --bin-interval ${BIN_INTERVAL} --batch-size ${BATCH_SIZE}
set +x

echo "======================================================"
echo " ⚠️ TERMINATED! ⚠️ (daily cron job)"
echo "======================================================"
