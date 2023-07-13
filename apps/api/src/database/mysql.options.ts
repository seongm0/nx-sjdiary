import { Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

import {
  AppConfigFactory,
  InjectAppConfig,
} from '../configs/app-config.factory';
import {
  InjectMysqlConfig,
  MysqlConfigFactory,
} from '../configs/mysql-config.factory';
import * as entities from '../entities';

import * as migrations from './migrations';

@Injectable()
export class MysqlOptions implements TypeOrmOptionsFactory {
  constructor(
    @InjectMysqlConfig()
    private readonly mysqlConfig: ConfigType<typeof MysqlConfigFactory>,
    @InjectAppConfig()
    private readonly appConfig: ConfigType<typeof AppConfigFactory>,
  ) {}

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    const { host, port, database, username, password, shouldMigrate } =
      this.mysqlConfig;

    const logging: LoggerOptions = this.appConfig.isProd
      ? ['info']
      : ['query', 'log', 'info', 'error'];

    return {
      type: 'mysql',
      host,
      port,
      database,
      username,
      password,
      entities,
      logging,
      migrations,
      migrationsRun: shouldMigrate,
    };
  }
}
