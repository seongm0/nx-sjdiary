import { type Dayjs } from 'dayjs';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DatetimeTransformer } from '../common/transformer';

import { CommonEntity } from './common.entity';
import { UserEntity } from './user.entity';

/**
 * 리뷰 entity
 */
@Entity({
  name: 'review',
})
export class ReviewEntity extends CommonEntity {
  @Column({ comment: '리뷰 내용' })
  content: string;

  @Column({
    comment: '시작일',
    name: 'started_at',
    type: 'datetime',
    transformer: DatetimeTransformer,
    nullable: true,
  })
  startedAt?: Dayjs;

  @Column({
    comment: '종료일',
    name: 'finished_at',
    type: 'datetime',
    transformer: DatetimeTransformer,
    nullable: true,
  })
  finishedAt?: Dayjs;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
