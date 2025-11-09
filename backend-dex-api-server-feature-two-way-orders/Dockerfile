FROM node:18-alpine3.20
ENV TZ=Central
ENV DOCKER_CONTAINER=1
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apk upgrade --no-cache && \
    apk add curl && \
    apk add --update jq

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY yarn.lock ./

ARG CI_REVISION=UNKNOWN_REVISION
ENV CI_REVISION=${CI_REVISION}

ARG CI_BUILD_TIME=UNKNOWN_BUILD_TIME
ENV CI_BUILD_TIME=${CI_BUILD_TIME}

ARG CI_BUILD_URL=UNKNOWN_BUILD
ENV CI_BUILD_URL=${CI_BUILD_URL}

ARG CI_REPO_URL=UNKNOWN_REPO
ENV CI_REPO_URL=${CI_REPO_URL}

ARG APP_PORT=3000
ENV APP_PORT=${APP_PORT}

ARG LOG_LEVEL=info
ENV LOG_LEVEL=${LOG_LEVEL}

RUN yarn install --production-only --quiet

COPY . .

ENV DISABLE_ERD=true
RUN yarn prisma generate
RUN yarn build
RUN yarn test

RUN chmod +x development-migration-rebuild.sh
RUN chmod +x start-dex-api-production.sh
RUN chmod +x start-daily-dex-dev-seed.sh
RUN chmod +x start-daily-job-production.sh

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk upgrade --no-cache

USER node
EXPOSE ${APP_PORT}

ENV ENV=/usr/src/app/.ashrc

ENTRYPOINT [ "./start-dex-api-production.sh" ]
