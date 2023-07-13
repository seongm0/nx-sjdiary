import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteReviewInput {
  @Field(() => ID)
  id: number;
}
