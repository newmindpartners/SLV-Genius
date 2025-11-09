[![CircleCI](https://dl.circleci.com/status-badge/img/gh/geniusyield/dex-client/tree/main.svg?style=svg&circle-token=35d0e02347e253da5352f198ca771463d0d9890b)](https://dl.circleci.com/status-badge/redirect/gh/geniusyield/dex-client/tree/main)

# Genius Yield DEX Client

## Getting started

### Run project

The project is run and build using [Vite](https://vitejs.dev/). To run the development environment, first run `yarn` to install packages then `yarn dev`.

Vite allows you to preview what the production build will look like. To do this, first build the `dist` assets using `yarn build` then run `yarn preview` which will start a server serving these built assets.

## HTTP Headers and Third-Party Integration

For securing our HTTP traffic and ensuring safe content delivery, our client makes use of a set of specific HTTP headers. These headers help protect against common web vulnerabilities and ensure only trusted third-party APIs and resources are utilized.

### Headers Overview

The complete list and explanations for each header used are available in our internal document: [HTTP Headers Configuration](/docs/headers.md).

### Adding New Third-Party APIs

When adding a new third-party API to any of our applications, it's crucial to update the CSP to allow the new domain. This process is detailed in the [HTTP Headers Configuration](/docs/headers.md) document.
