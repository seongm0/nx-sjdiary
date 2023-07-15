import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { TodoEntity } from './../entities/todo.entity';

@ObjectType()
export class TodoModel {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  content!: string;

  @Field(() => Float, { nullable: true })
  startedAt?: number;

  @Field(() => Float, { nullable: true })
  finishedAt?: number;

  @Field(() => Float, { nullable: true })
  completedAt?: number;

  constructor(todo: TodoEntity) {
    this.id = todo.id;
    this.content = todo.content;
    this.startedAt = todo.startedAt ? +todo.startedAt : undefined;
    this.finishedAt = todo.finishedAt ? +todo.finishedAt : undefined;
    this.completedAt = todo.completedAt ? +todo.completedAt : undefined;
  }
}
