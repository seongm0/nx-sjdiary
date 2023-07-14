import { Module } from '@nestjs/common';

import { AuthModule } from '../auth';
import { CustomConfigModule } from '../configs/custom-config.module';
import { DatabaseModule } from '../database';
import { CustomGraphqlModule } from '../graphql';
import { ReviewsModule } from '../reviews';
import { TodosModule } from '../todos';
import { UsersModule } from '../users';
import { UtilModule } from '../utils';

import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    CustomConfigModule,
    CustomGraphqlModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    TodosModule,
    ReviewsModule,
    UtilModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
