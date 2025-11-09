## Deployment to production

The most recent revision from the [main](https://github.com/geniusyield/dex-api-server/tree/main) branch can be deployed to the mainnet and preprod environments of the production cluster using the following `yarn` scripts:

- `yarn deploy:mainnet`
- `yarn deploy:preprod`

Please note:

- The tip of the remote main branch (on GitHub) is going to be deployed.
- The local state of the repository won't be changed. The script changes the remote deployment branch ([mainnet](https://github.com/geniusyield/dex-api-server/tree/mainnet) or [preprod](https://github.com/geniusyield/dex-api-server/tree/preprod)) to point to the same commit as the remote main.

For further details about the deployment process and our CI/CD pipelines see the following Confluence article:

- [CI/CD Pipelines](https://geniusyield.atlassian.net/l/cp/1HtQdthk)
