import { EntityRepository, Repository } from 'typeorm';

import { TodoEntity } from '../entities';

@EntityRepository(TodoEntity)
export class TodosRepository extends Repository<TodoEntity> {}
