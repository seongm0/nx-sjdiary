import { Column, Entity, OneToMany } from 'typeorm';

import { CommonEntity } from './common.entity';
import { ReviewEntity } from './review.entity';
import { TodoEntity } from './todo.entity';

@Entity({
  name: 'user',
})
export class UserEntity extends CommonEntity {
  @Column({ name: 'auth0_id', unique: true })
  auth0Id!: string;

  @Column()
  email!: string;

  @Column()
  name!: string;

  @Column({ name: 'profile_image_url' })
  profileImageUrl!: string;

  @OneToMany(() => TodoEntity, (todo) => todo.user)
  todos: TodoEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];
}
