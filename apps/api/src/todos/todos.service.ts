import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-express';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { IAuth0User } from '../auth';
import { TodoEntity, UserEntity } from '../entities';

import { TodoModel } from './../models';
import {
  CreateTodoInput,
  DeleteTodoInput,
  TodosInput,
  UpdateTodoInput,
} from './dto/input';

@Injectable()
export class TodosService {
  @InjectRepository(TodoEntity)
  private readonly todoRepo: Repository<TodoEntity>;
  @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>;

  async todos(
    { sub }: IAuth0User,
    { startDate, endDate }: TodosInput,
  ): Promise<TodoModel[]> {
    const user = await this.userRepo.findOneBy({ auth0Id: sub });

    const duplicateWheres = {
      user,
      deletedAt: IsNull(),
    };

    const todos = await this.todoRepo.find({
      where: [
        {
          ...duplicateWheres,
          startedAt: MoreThanOrEqual(new Date(startDate)),
          finishedAt: LessThanOrEqual(new Date(endDate)),
        },
        {
          ...duplicateWheres,
          startedAt: IsNull(),
          finishedAt: IsNull(),
        },
      ],
    });

    return todos.map((todo) => new TodoModel(todo));
  }

  async createTodo(
    { sub }: IAuth0User,
    { content, startedAt, finishedAt }: CreateTodoInput,
  ): Promise<TodoModel> {
    const user = await this.userRepo.findOneBy({ auth0Id: sub });

    const unSetTimeTodos = await this.todoRepo.find({
      where: {
        user,
        startedAt: IsNull(),
        finishedAt: IsNull(),
        deletedAt: IsNull(),
      },
    });

    if (3 < unSetTimeTodos.length) {
      throw new ApolloError('does not create todo');
    }

    const todo = await this.todoRepo.save({
      user,
      content,
      startedAt: startedAt ? new Date(startedAt) : undefined,
      finishedAt: finishedAt ? new Date(finishedAt) : undefined,
    });

    return new TodoModel(todo);
  }

  async updateTodo(
    { sub }: IAuth0User,
    input: UpdateTodoInput,
  ): Promise<TodoModel> {
    const user = await this.userRepo.findOneBy({ auth0Id: sub });

    if (Object.keys(input).length < 1) {
      throw new ApolloError('input is empty');
    }

    const todo = await this.todoRepo.findOneBy({
      user,
      id: input.id,
    });

    if (input.content) {
      todo.content = input.content;
    }

    if (input.isCompleted) {
      todo.completedAt = new Date();
    } else {
      if (input.isCompleted === false) {
        todo.completedAt = null;
      }
    }

    if (input.startedAt) {
      todo.startedAt = new Date(input.startedAt);
    }

    if (input.finishedAt) {
      todo.finishedAt = new Date(input.finishedAt);
    }

    const updatedTodo = await this.todoRepo.save(todo);

    return new TodoModel(updatedTodo);
  }

  async deleteTodo(
    { sub }: IAuth0User,
    { id }: DeleteTodoInput,
  ): Promise<boolean> {
    try {
      const user = await this.userRepo.findOneBy({ auth0Id: sub });

      await this.todoRepo.softDelete({ user, id, deletedAt: IsNull() });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
