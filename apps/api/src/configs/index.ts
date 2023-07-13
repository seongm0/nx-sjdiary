import { AppConfigFactory } from './app-config.factory';
import { Auth0ConfigFactory } from './auth0-config.factory';
import { MysqlConfigFactory } from './mysql-config.factory';

export const configurations = [
  AppConfigFactory,
  Auth0ConfigFactory,
  MysqlConfigFactory,
];
