import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { UserEntity } from '../entities';

import { CommonEntity } from './common.entity';

@Entity({
  name: 'review',
})
export class ReviewEntity extends CommonEntity {
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

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  user: UserEntity;

  @JoinColumn({ name: 'user_id' })
  userId: number;
}
