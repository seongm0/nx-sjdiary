import { EntityRepository, IsNull, Repository } from 'typeorm';

import { UserEntity } from '../entities';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async findByAuth0Id(auth0Id: string) {
    return await this.findOneBy({
      auth0Id,
      deletedAt: IsNull(),
    });
  }
}
