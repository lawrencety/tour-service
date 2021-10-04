import { getConnectionOptions } from './getConnectionOptions';
import path from 'path';

const defaultOptions = getConnectionOptions();

module.exports = [
  defaultOptions,
  {
    ...defaultOptions,
    name: 'seed',
    migrations: [path.join(__dirname, 'seed', '@(*.js|*.ts)')],
    cli: { migrationsDir: path.join(__dirname, 'seed') },
  },
];
