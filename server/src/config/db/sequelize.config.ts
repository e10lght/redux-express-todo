import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgres', 'postgres', 'passw0rd', {
  host: '127.0.0.1',
  port: 5436,
  dialect: 'postgres',
  logging: false
});
