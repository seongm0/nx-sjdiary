import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteTodoInput {
  @Field(() => ID)
  id: number;
}
