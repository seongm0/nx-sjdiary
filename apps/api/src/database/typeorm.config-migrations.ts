import { DataSource } from 'typeorm';

import { entities } from '../entities';

import { migrations } from './migrations';

console.log({
  DB_MIGRATION_HOST: process.env.DB_MIGRATION_HOST,
  DB_MIGRATION_PORT: process.env.DB_MIGRATION_PORT,
  DB_MIGRATION_USERNAME: process.env.DB_MIGRATION_USERNAME,
  DB_MIGRATION_PASSWORD: process.env.DB_MIGRATION_PASSWORD,
  DB_MIGRATION_DATABASE: process.env.DB_MIGRATION_DATABASE,
});

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_MIGRATION_HOST,
  port: Number(process.env.DB_MIGRATION_PORT),
  database: process.env.DB_MIGRATION_USERNAME,
  username: process.env.DB_MIGRATION_PASSWORD,
  password: process.env.DB_MIGRATION_DATABASE,
  entities,
  migrations,
});
