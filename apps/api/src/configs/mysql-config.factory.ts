import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

interface MysqlConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  shouldMigrate: boolean;
}

export const MysqlConfigFactory = registerAs(
  'mysql',
  (): MysqlConfig => ({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    shouldMigrate: process.env.DB_MIGRATE === 'true',
  })
);

export const InjectMysqlConfig = () => Inject(MysqlConfigFactory.KEY);
