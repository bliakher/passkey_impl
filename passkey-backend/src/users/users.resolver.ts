import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UserService } from './service/user.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UserService) {}

  @Query(() => User, { name: 'user', description: 'Get user by ID' })
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return await this.usersService.findOneById(id);
  }
}
