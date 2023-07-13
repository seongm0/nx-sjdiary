import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { ReviewEntity } from './../entities';

@ObjectType()
export class ReviewModel {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  content: string;

  @Field(() => Float, { nullable: true })
  startedAt?: number;

  @Field(() => Float, { nullable: true })
  finishedAt?: number;

  constructor(review: ReviewEntity) {
    this.id = review.id;
    this.content = review.content;
    this.startedAt = review.startedAt
      ? new Date(review.startedAt).getTime()
      : undefined;
    this.finishedAt = review.finishedAt
      ? new Date(review.finishedAt).getTime()
      : undefined;
  }
}
