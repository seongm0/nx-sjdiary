import * as path from 'path';

import { ApolloDriverConfig } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql/error';

import {
  AppConfigFactory,
  InjectAppConfig,
} from '../configs/app-config.factory';

export class CustomGraphqlConfig implements GqlOptionsFactory {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectAppConfig()
    private readonly appConfig: ConfigType<typeof AppConfigFactory>,
  ) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: path.resolve(__dirname, 'schema.gql'),
      playground: !this.appConfig.isProd,
      sortSchema: true,
      formatError: this.formatError,
    };
  }

  private formatError(error: GraphQLError): GraphQLFormattedError {
    this.logger.debug(error);

    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
    };
  }
}
