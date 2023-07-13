import * as process from 'process';

import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

import { Environment } from './config.constant';

interface AppConfig {
  appName: string;
  port: number;
  isProd: boolean;
  isLocal: boolean;
}

export const AppConfigFactory = registerAs('app', (): AppConfig => {
  const env = process.env.APP_ENV;

  return {
    appName: process.env.APP_NAME,
    port: Number(process.env.APP_PORT),
    isProd: env === Environment.PROD,
    isLocal: env === Environment.LOCAL,
  };
});

export const InjectAppConfig = () => Inject(AppConfigFactory.KEY);
