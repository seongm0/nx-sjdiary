import { Field, Float, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTodoInput {
  @Field(() => ID)
  id: number;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => Float, { nullable: true })
  startedAt?: number;

  @Field(() => Float, { nullable: true })
  finishedAt?: number;

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean;
}
