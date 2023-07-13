import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth0User, GqlAuthGuard, IAuth0User } from '../auth';
import { TodoModel } from '../models';

import {
  CreateTodoInput,
  DeleteTodoInput,
  TodosInput,
  UpdateTodoInput,
} from './dto/input';
import { TodosService } from './todos.service';

@Resolver(() => TodoModel)
export class TodosResolver {
  constructor(private readonly todoService: TodosService) {}

  @Query(() => [TodoModel])
  @UseGuards(GqlAuthGuard)
  async todos(
    @Auth0User() authUser: IAuth0User,
    @Args('input') input: TodosInput,
  ): Promise<TodoModel[]> {
    return await this.todoService.todos(authUser, input);
  }

  @Mutation(() => TodoModel)
  @UseGuards(GqlAuthGuard)
  async createTodo(
    @Auth0User() authUser: IAuth0User,
    @Args('input') input: CreateTodoInput,
  ): Promise<TodoModel> {
    return await this.todoService.createTodo(authUser, input);
  }

  @Mutation(() => TodoModel)
  @UseGuards(GqlAuthGuard)
  async updateTodo(
    @Auth0User() authUser: IAuth0User,
    @Args('input') input: UpdateTodoInput,
  ): Promise<TodoModel> {
    return await this.todoService.updateTodo(authUser, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteTodo(
    @Auth0User() authUser: IAuth0User,
    @Args('input') input: DeleteTodoInput,
  ): Promise<boolean> {
    return await this.todoService.deleteTodo(authUser, input);
  }
}
