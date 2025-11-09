## Prerequisite

When the docker environment is setup it will create a project with rounds for the launch pad. The rounds require having their prices set. In order to do so a request must be made per round to the core server. In order to reach the dev core server one must be one the VPN.

## Run server on local machine with Docker Compose

```shell
git clone https://github.com/geniusyield/dex-api-server
cd dex-api-server
yarn install
docker compose up
```

## Optional profiles

Docker compose has added support for profiles which allow for optional services to be defined but only run if included in the profile flags at runtime.

https://docs.docker.com/compose/profiles/

Currently all required services have no profiles set.

Optional services:

- Tooling: profile of `tools`
- Oura related: profile of `oura`

Example to start with additional services:

```shell
docker-compose --profile oura-n2n up
docker-compose --profile tools up
```

### Oura profile

Note that oura will hit the webhook endpoints which are protected via basic auth. The basic auth environment variables will be required in order for the webhooks events to be received correctly. See [basic auth](/docs/basic-auth.md)

```shell
docker-compose --profile oura-n2n up
```
