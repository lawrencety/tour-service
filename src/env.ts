export const getNodeEnv = (): string => process.env.NODE_ENV || 'production';
export const getPort = (): number => +process.env.PORT || 4000;

export const getDbHost = (): string => process.env.DB_HOST || 'localhost';
export const getDbPort = (): number => +process.env.DB_PORT || 5432;
export const getDbSchema = (): string => process.env.DB_SCHEMA || 'public';
export const getDbUser = (): string => process.env.DB_USER || 'touring';
export const getDbPassword = (): string => process.env.DB_PASSWORD || 'touring';
export const getDbName = (): string => process.env.DB_NAME || 'touring';
export const getDbSync = (): boolean => !!process.env.DB_SYNC || false;
export const getDbSslCert = (): string =>
  process.env.DB_SSL_CERT ? Buffer.from(process.env.DB_SSL_CERT, 'base64').toString() : undefined;

