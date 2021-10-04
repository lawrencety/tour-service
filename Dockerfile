FROM node:14.17.6-alpine3.11 AS build

ENV APP_HOME /opt/service

RUN mkdir -p ${APP_HOME}

WORKDIR ${APP_HOME}

COPY . ${APP_HOME}/

RUN apk add g++ gcc libc-dev make python cmake && \
  npm ci && \
  npm run build && \
  npm prune --production

FROM node:14.17.6-alpine3.11

ENV APP_HOME /opt/service

RUN mkdir -p ${APP_HOME}

WORKDIR ${APP_HOME}

COPY --from=build ${APP_HOME}/package.json ${APP_HOME}/
COPY --from=build ${APP_HOME}/dist ${APP_HOME}/dist
COPY --from=build ${APP_HOME}/src/database/sql ${APP_HOME}/dist/database/sql
COPY --from=build ${APP_HOME}/node_modules ${APP_HOME}/node_modules
COPY --from=build ${APP_HOME}/src/notification/templates ${APP_HOME}/dist/notification/templates

EXPOSE 10002

CMD [ "npm", "run",  "start" ]
