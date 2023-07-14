import { LogLevel } from '@nestjs/common/services/logger.service';
import { ConfigService, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { AppConfigFactory } from './configs/app-config.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig: ConfigType<typeof AppConfigFactory> = app
    .get(ConfigService)
    .get('app');

  const loggerLevels: LogLevel[] =
    appConfig.isProd === true
      ? ['log', 'warn', 'error']
      : ['log', 'warn', 'error', 'debug', 'verbose'];
  app.useLogger(loggerLevels);

  app.enableCors({
    origin: true,
  });
  await app.listen(appConfig.port);

  console.log(`SJDiary Server Start. Port: ${appConfig.port}`);
}

bootstrap();
