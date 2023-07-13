import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IAuth0User } from '../auth';
import { UserEntity } from '../entities';
import { UserModel } from '../models';

import { CreateUserInput } from './dto/input';

@Injectable()
export class UsersService {
  @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>;

  async verifyUser({ sub }: IAuth0User): Promise<boolean> {
    const user = await this.userRepo.findOneBy({ auth0Id: sub });
    return !!user;
  }

  async me({ sub }: IAuth0User): Promise<UserModel> {
    const user = await this.userRepo.findOneBy({ auth0Id: sub });

    return new UserModel(user);
  }

  async createUser(authUser: IAuth0User, input: CreateUserInput) {
    const user = await this.userRepo.save({
      auth0Id: authUser.sub,
      ...input,
    });

    return new UserModel(user);
  }
}
