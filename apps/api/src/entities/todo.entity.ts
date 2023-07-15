import { type Dayjs } from 'dayjs';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DatetimeTransformer } from '../common/transformer';

import { CommonEntity } from './common.entity';
import { UserEntity } from './user.entity';

/**
 * 오늘의 할일 entity
 */
@Entity({
  name: 'todo',
})
export class TodoEntity extends CommonEntity {
  @Column({ comment: 'TODO 내용' })
  content: string;

  @Column({
    comment: 'TODO 시작 시간',
    name: 'started_at',
    type: 'datetime',
    transformer: DatetimeTransformer,
    nullable: true,
  })
  startedAt?: Dayjs;

  @Column({
    comment: 'TODO 완료 시간',
    name: 'finished_at',
    type: 'datetime',
    transformer: DatetimeTransformer,
    nullable: true,
  })
  finishedAt?: Dayjs;

  @Column({
    comment: 'TODO 완료 시간',
    name: 'completed_at',
    type: 'datetime',
    transformer: DatetimeTransformer,
    nullable: true,
  })
  completedAt?: Dayjs;

  @ManyToOne(() => UserEntity, (user) => user.todos)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
