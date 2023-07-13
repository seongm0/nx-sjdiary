import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserEntity } from '../entities';

import { CommonEntity } from './common.entity';

@Entity({
  name: 'todo',
})
export class TodoEntity extends CommonEntity {
  @Column()
  content: string;

  @Column({
    name: 'started_at',
    type: 'timestamp',
    nullable: true,
  })
  startedAt?: Date;

  @Column({
    name: 'finished_at',
    type: 'timestamp',
    nullable: true,
  })
  finishedAt?: Date;

  @Column({
    name: 'completed_at',
    type: 'timestamp',
    nullable: true,
  })
  completedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.todos)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
