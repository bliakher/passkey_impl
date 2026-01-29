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

export class LoginFailedError extends GraphQLError {
  constructor() {
    super('Username or password incorrect', {
      extensions: {
        code: 'LOGIN_FAILED',
        http: { status: 400 },
      },
    });
  }
}

export class RefreshTokenInvalidError extends GraphQLError {
  constructor() {
    super('Refresh token invalid', {
      extensions: {
        code: 'REFRESH_INVALID',
        http: { status: 400 },
      },
    });
  }
}
