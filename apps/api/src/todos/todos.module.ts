import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodoEntity } from '../entities';
import { UsersModule } from '../users';

import { TodosResolver } from './todos.resolver';
import { TodosService } from './todos.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity]), UsersModule],
  providers: [TodosResolver, TodosService],
  exports: [TypeOrmModule],
})
export class TodosModule {}
