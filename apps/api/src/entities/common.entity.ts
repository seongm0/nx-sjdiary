import { Field, ID, ObjectType } from '@nestjs/graphql';
import { type Dayjs } from 'dayjs';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DatetimeTransformer } from '../common/transformer';

@ObjectType()
export abstract class CommonEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    transformer: DatetimeTransformer,
  })
  createdAt!: Dayjs;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    transformer: DatetimeTransformer,
    nullable: true,
  })
  updatedAt?: Dayjs;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    transformer: DatetimeTransformer,
    nullable: true,
  })
  deletedAt?: Dayjs;
}
