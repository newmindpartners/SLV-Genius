run:
	yarn install
	VITE_CARDANO_NETWORK=mainnet VITE_API_URL=https://api.geniusyield.co yarn build
	docker build -t dex-client .
	docker run -it -p 3000:3000 -e K8S_NAMESPACE=LOCAL -e K8S_POD_NAME=DEX-CLIENT dex-client
