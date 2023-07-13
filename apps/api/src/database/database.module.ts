import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomConfigModule } from '../configs/custom-config.module';

import { MysqlOptions } from './mysql.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: MysqlOptions,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
