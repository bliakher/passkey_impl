import { GraphQLError } from 'graphql/error';

export class InvalidUsernameError extends GraphQLError {
  constructor() {
    super('User not found', {
      extensions: {
        code: 'USER_NOT_FOUND',
        http: { status: 400 },
      },
    });
  }
}
