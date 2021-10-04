import { ConnectionOptions } from 'typeorm';
import {
  getDbHost,
  getDbPort,
  getDbUser,
  getDbPassword,
  getDbName,
  getDbSync,
  getDbSslCert,
  getDbSchema,
} from '../env';
import path from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const getConnectionOptions = (overrides?: Partial<PostgresConnectionOptions>): ConnectionOptions => ({
  type: 'postgres',
  host: getDbHost(),
  port: getDbPort(),
  schema: getDbSchema(),
  username: getDbUser(),
  password: getDbPassword(),
  database: getDbName(),
  entities: [

  ],
  migrations: [path.join(__dirname, 'migration', '@(*.js|*.ts)')],
  cli: { migrationsDir: path.join(__dirname, 'migration') },
  synchronize: getDbSync(),
  ...(getDbSslCert() && { ssl: { ca: getDbSslCert() } }),
  ...overrides,
});
