import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './service/user.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/auth/service/gql-auth-guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => User, { name: 'user', description: 'Get user by ID' })
  async getUser(@Args('id', { type: () => String }) id: string) {
    return await this.usersService.getUserWithCredentials(id);
  }
}
