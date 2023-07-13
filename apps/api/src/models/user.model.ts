import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserEntity } from './../entities';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  profileImageUrl: string;

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.email = userEntity.email;
    this.name = userEntity.name;
    this.profileImageUrl = userEntity.profileImageUrl;
  }
}
