import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { CustomGraphqlConfig } from './custom-graphql.config';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useClass: CustomGraphqlConfig,
    }),
  ],
  exports: [GraphQLModule],
})
export class CustomGraphqlModule {}
