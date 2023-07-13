import { Field, Float, InputType } from '@nestjs/graphql';

import { TodoModel } from '../../../models';

@InputType()
export class CreateTodoInput
  implements Pick<TodoModel, 'content' | 'startedAt' | 'finishedAt'>
{
  @Field(() => String)
  content: string;

  @Field(() => Float, { nullable: true })
  startedAt?: number;

  @Field(() => Float, { nullable: true })
  finishedAt?: number;
}
