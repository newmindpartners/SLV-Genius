## Bypass KYC

```shell
git clone https://github.com/geniusyield/dex-api-server
cd dex-api-server
yarn install
WALLET_PUBLIC_KEY='addr_test1qqprvf945g3xqmyj27a7m5ask8kzgtne2yplu0z5rh0vmyaxg9d7ew7cue7xfg4f5a5tjepk3psrkfh35engyasc5x7qm97ha3' yarn seed:dev
yarn start:dev
```

## Set demo wallet account (kyc) via env var file

Run the below from project root.
Replace the WALLET_PUBLIC_KEY with your public wallet address.

```
touch .local.env && echo 'WALLET_PUBLIC_KEY=addr_test1qzsuzd5pzf9ehn3c8jwny6zlns5mwajehklk0dukxscqyq4lpgyhe48246el4tfpew82k7n2fdtvjgtttw2v4cmq6u8ss2am4g' >> .local.env
```

## Set demo wallet account (kyc) using Docker

```
docker-compose exec -e WALLET_PUBLIC_KEY=addr_test1qqp52wum0uem8cyem5kmfwsxhtfuef7a6jd7s7ekqjgf8jltheyudlm7g5a3w8ylhgq8s4htmq98qml2rs7mkpqhgx6scrtcmh dex-api sh -c "yarn seed:dev"
```
