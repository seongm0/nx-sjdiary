import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class ReviewsInput {
  @Field(() => Float)
  startDate: number;

  @Field(() => Float)
  endDate: number;
}
