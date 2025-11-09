## Set Round Price

This script sets the round price, validates the round parameters via the transaction server and sets the round script address.

```
yarn cli:dev set-round-price --round-code CRU/1 --price-usd 100 --price-lovelace 2300000
```

--round-code is the `project asset shortname` and the `round number` separated by `/`. This is used to uniquely find the round.

--price-usd is the price in USD _cents_ for 1 ADA input manually at the time the script is run.

--price-lovelace is the price in lovelace for 1 of the display unit of the project asset. For example: the lovelace value for 1 GENS or 1_000_000 GENIES.

[![CircleCI](https://circleci.com/gh/geniusyield/dex-api-server/tree/main.svg?style=svg&circle-token=19834ef6dec83a145d109faf0ac97a5d57415809)](https://circleci.com/gh/geniusyield/dex-api-server/tree/main)

[![ArgoCD](https://argocd.dev.geniusyield.co/api/badge?name=dex-api-server)](https://argocd.dev.geniusyield.co/applications/dex-api-server?view=tree&resource=)
