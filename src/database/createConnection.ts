import { Connection, createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { getConnectionOptions } from './getConnectionOptions';

export default (overrides?: Partial<PostgresConnectionOptions>): Promise<Connection> =>
  createConnection(getConnectionOptions(overrides));
