import 'reflect-metadata';
import express from 'express';
import { Container } from 'typedi';
import {
  useExpressServer,
  useContainer as routingControllersUseContainer,
  Action,
  getMetadataArgsStorage,
} from 'routing-controllers';
import { getRepository, useContainer as typeOrmUseContainer } from 'typeorm';
import createConnection from './database/createConnection';
import { User } from './user/model/User';
import swaggerUi from 'swagger-ui-express';
import { getNodeEnv } from './env';
import { requestContextMiddleware } from './requestContext';
import { STATUSES_TOKEN } from './tokens';
import { Status } from './meta/model/Status';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

export const createApp = async (): Promise<express.Express> => {
  // if we are in development read .env file otherwise env vars are provided by k8s
  if (getNodeEnv() === 'development') {
    const dotenv = (await import('dotenv')).default;
    dotenv.config();
  }

  const app = express();

  app.use(requestContextMiddleware);

  routingControllersUseContainer(Container);
  typeOrmUseContainer(Container);

  await createConnection();

  Container.set(STATUSES_TOKEN, await getRepository(Status).find());

  useExpressServer(app, {
    controllers: [`${__dirname}/**/*Controller{.js,.ts}`],
    authorizationChecker: (): boolean => true,
    currentUserChecker: (action: Action): User =>
      action.request.headers['x-user'] ? JSON.parse(action.request.headers['x-user']) : undefined,
  });

  app.use('/v1/docs/swagger.json', (_, res) => res.send(getOpenApiJson()));
  app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(getOpenApiJson()));

  return app;
};

const getOpenApiJson = (): Record<string, unknown> => {
  return routingControllersToSpec(getMetadataArgsStorage(), undefined, {
    components: { schemas: validationMetadatasToSchemas({ refPointerPrefix: '#/components/schemas/' }) },
    info: { title: 'Touring BE API', version: '1' },
  });
};
