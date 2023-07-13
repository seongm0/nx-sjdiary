import { Global, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { AppConfigFactory, InjectAppConfig } from './app-config.factory';
import { Auth0ConfigFactory, InjectAuth0Config } from './auth0-config.factory';
import { Environment } from './config.constant';
import { configValidationSchema } from './config.validate';
import { InjectMysqlConfig, MysqlConfigFactory } from './mysql-config.factory';

import { configurations } from './index';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: process.env.NODE_ENV === Environment.PROD,
      validationSchema: configValidationSchema,
      load: configurations,
    }),
  ],
})
export class CustomConfigModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectAppConfig()
    private readonly appConfig: ConfigType<typeof AppConfigFactory>,
    @InjectMysqlConfig()
    private readonly mysqlConfig: ConfigType<typeof MysqlConfigFactory>,
    @InjectAuth0Config()
    private readonly auth0Config: ConfigType<typeof Auth0ConfigFactory>,
  ) {}

  onApplicationBootstrap() {
    this.logger.debug('========environment========');
    this.logger.debug(`app: ${JSON.stringify(this.appConfig, null, 2)}`);
    this.logger.debug(`mysql: ${JSON.stringify(this.mysqlConfig, null, 2)}`);
    this.logger.debug(`auth0: ${JSON.stringify(this.auth0Config, null, 2)}`);
  }
}
