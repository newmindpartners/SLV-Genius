FROM node:18-alpine
ENV TZ=Central
ENV DOCKER_CONTAINER=1

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

RUN apk upgrade --no-cache
RUN apk --no-cache add curl

COPY package*.json ./
COPY tsconfig.json ./
COPY yarn.lock ./

COPY . .

RUN chmod +x ./start-dex-client-production.sh

COPY serve.json /dist/

# ==========[ METADATA ]==========

ARG CI_REVISION=UNKNOWN_REVISION
ENV CI_REVISION=${CI_REVISION}

ARG CI_BUILD_TIME=UNKNOWN_BUILD_TIME
ENV CI_BUILD_TIME=${CI_BUILD_TIME}

ARG CI_BRANCH=UNKNOWN_BRANCH
ENV CI_BRANCH=${CI_BRANCH}

ARG CI_BUILD_URL=UNKNOWN_BUILD
ENV CI_BUILD_URL=${CI_BUILD_URL}

ARG CI_REPO_URL=UNKNOWN_REPO
ENV CI_REPO_URL=${CI_REPO_URL}

ARG APP_PORT=3000
ENV APP_PORT=${APP_PORT}

ARG LOG_LEVEL=info
ENV LOG_LEVEL=${LOG_LEVEL}

# ==========[ SECURITY PATCHES ]==========
RUN apk upgrade --no-cache

CMD ["./start-dex-client-production.sh"]
