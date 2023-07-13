import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewEntity } from '../entities';
import { UsersModule } from '../users';

import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]), UsersModule],
  providers: [ReviewsResolver, ReviewsService],
  exports: [TypeOrmModule],
})
export class ReviewsModule {}
