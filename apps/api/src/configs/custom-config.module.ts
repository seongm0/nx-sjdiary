import { Global, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Environment } from './config.constant';
import { configValidationSchema } from './config.validate';

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

  onApplicationBootstrap(): any {
    this.logger.debug('========environment========');
    // this.logger.debug(`mysql: ${JSON.stringify(mysql, null, 2)}`);
    // this.logger.debug(`app: ${JSON.stringify(app, null, 2)}`);
    // this.logger.debug(`externalApi: ${JSON.stringify(externalApi, null, 2)}`);
  }
}
