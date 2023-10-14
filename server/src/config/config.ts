export const DB_CONFIG = {
  name: process.env.DB_NAME || 'postgres',
  userName: process.env.DB_USER_NAME || 'postgres',
  pass: process.env.DB_PASS || 'passw0rd',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5436,
  dialect: (process.env.DB_DIALECT || 'postgres') as
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mariadb'
    | 'mssql',
  logging: Boolean(process.env.DB_LOGGING) || false
};

export const PORT = process.env.PORT || 3000;

export const SECRET_KEY = process.env.SECRET_KEY || '123456789';
