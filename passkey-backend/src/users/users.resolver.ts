import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './service/user.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/auth/service/gql-auth-guard';
import { GraphQLError } from 'graphql';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => User, { name: 'user', description: 'Get user by ID' })
  async getUser(@Args('id', { type: () => String }) id: string): Promise<User> {
    const user = await this.usersService.getUserWithCredentials({ id });
    if (!user) {
      throw new GraphQLError('No user found');
    }
    console.log('user query:', user);
    return {
      id: user.id,
      username: user.username,
      credentials: user.credentials.map((cred) => ({
        id: cred.id,
        device: cred.device,
        createdAt: cred.created_at,
        publicKey: Buffer.from(cred.public_key).toString('base64'),
      })),
    };
  }
}
