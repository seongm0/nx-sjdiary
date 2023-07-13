import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { TodoEntity } from './../entities/todo.entity';

@ObjectType()
export class TodoModel {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  content: string;

  @Field(() => Float, { nullable: true })
  startedAt?: number;

  @Field(() => Float, { nullable: true })
  finishedAt?: number;

  @Field(() => Float, { nullable: true })
  completedAt?: number;

  constructor(todo: TodoEntity) {
    this.id = todo.id;
    this.content = todo.content;
    this.startedAt = todo.startedAt
      ? new Date(todo.startedAt).getTime()
      : undefined;
    this.finishedAt = todo.finishedAt
      ? new Date(todo.finishedAt).getTime()
      : undefined;
    this.completedAt = todo.completedAt
      ? new Date(todo.completedAt).getTime()
      : undefined;
  }
}
