import { GraphQLError } from 'graphql';

export class UsernameAlreadyUsedError extends GraphQLError {
  constructor() {
    super('User with username already exists', {
      extensions: {
        code: 'USERNAME_ALREADY_USED',
        http: { status: 400 },
      },
    });
  }
}
