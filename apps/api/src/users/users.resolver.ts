import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Auth0User, GqlAuthGuard, IAuth0User } from '../auth';
import { UserModel } from '../models';

import { CreateUserInput } from './dto/input';
import { UsersService } from './users.service';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async verifyUser(@Auth0User() authUser: IAuth0User): Promise<boolean> {
    return await this.userService.verifyUser(authUser);
  }

  @Query(() => UserModel)
  @UseGuards(GqlAuthGuard)
  async me(@Auth0User() authUser: IAuth0User): Promise<UserModel> {
    return await this.userService.me(authUser);
  }

  @Mutation(() => UserModel)
  @UseGuards(GqlAuthGuard)
  async createUser(
    @Auth0User() authUser: IAuth0User,
    @Args('input') input: CreateUserInput,
  ): Promise<UserModel> {
    return await this.userService.createUser(authUser, input);
  }
}
