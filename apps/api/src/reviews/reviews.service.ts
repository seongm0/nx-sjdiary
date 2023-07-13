import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-express';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { IAuth0User } from '../auth';
import { ReviewEntity, UserEntity } from '../entities';

import { ReviewModel } from './../models';
import {
  CreateReviewInput,
  DeleteReviewInput,
  ReviewsInput,
  UpdateReviewInput,
} from './dto/input';

@Injectable()
export class ReviewsService {
  @InjectRepository(ReviewEntity)
  private readonly reviewRepo: Repository<ReviewEntity>;
  @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>;

  async reviews(
    { sub }: IAuth0User,
    { startDate, endDate }: ReviewsInput,
  ): Promise<ReviewModel[]> {
    const user = await this.userRepo.findOneBy({ auth0Id: sub });

    const duplicateWheres = {
      user,
      deletedAt: IsNull(),
    };

    const reviews = await this.reviewRepo.find({
      where: [
        {
          startedAt: MoreThanOrEqual(new Date(startDate)),
          finishedAt: LessThanOrEqual(new Date(endDate)),
          ...duplicateWheres,
        },
        {
          startedAt: IsNull(),
          finishedAt: IsNull(),
          ...duplicateWheres,
        },
      ],
    });

    return reviews.map((review) => new ReviewModel(review));
  }

  async createReview(
    { sub }: IAuth0User,
    { content, startedAt, finishedAt }: CreateReviewInput,
  ): Promise<ReviewModel> {
    const user = await this.userRepo.findOneBy({ auth0Id: sub });

    const pendingTimeReviews = await this.reviewRepo.find({
      where: [
        {
          user,
          startedAt: IsNull(),
          finishedAt: IsNull(),
          deletedAt: IsNull(),
        },
      ],
    });

    if (3 < pendingTimeReviews.length) {
      throw new ApolloError('does not create review');
    }

    const review = await this.reviewRepo.save({
      user,
      content,
      startedAt: startedAt ? new Date(startedAt) : undefined,
      finishedAt: finishedAt ? new Date(finishedAt) : undefined,
    });

    return new ReviewModel(review);
  }

  async updateReview(
    { sub }: IAuth0User,
    input: UpdateReviewInput,
  ): Promise<ReviewModel> {
    const user = await this.userRepo.findOneBy({ auth0Id: sub });

    if (Object.keys(input).length < 1) {
      throw new ApolloError('This input is empty');
    }

    const review = await this.reviewRepo.findOneBy({
      user,
      id: input.id,
    });

    if (input.content) {
      review.content = input.content;
    }

    if (input.startedAt) {
      review.startedAt = new Date(input.startedAt);
    }

    if (input.finishedAt) {
      review.finishedAt = new Date(input.finishedAt);
    }

    const updatedReview = await this.reviewRepo.save(review);

    return new ReviewModel(updatedReview);
  }

  async deleteReview(
    { sub }: IAuth0User,
    { id }: DeleteReviewInput,
  ): Promise<boolean> {
    try {
      const user = await this.userRepo.findOneBy({ auth0Id: sub });

      await this.reviewRepo.softDelete({ user, id, deletedAt: IsNull() });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
