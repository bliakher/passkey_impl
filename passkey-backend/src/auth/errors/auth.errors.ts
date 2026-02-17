import { GraphQLError } from 'graphql';

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

export class PasskeyRegistrationVerificationFailed extends GraphQLError {
  constructor() {
    super('Passkey registration verification failed', {
      extensions: {
        code: 'PASSKEY_REG_FAILED',
        http: { status: 400 },
      },
    });
  }
}

export class InvalidChallengeError extends GraphQLError {
  constructor() {
    super('Challenge is invalid', {
      extensions: {
        code: 'INVALID_CHALLENGE',
        http: { status: 400 },
      },
    });
  }
}

export class InvalidCredentialIdError extends GraphQLError {
  constructor() {
    super('Credential ID is invalid', {
      extensions: {
        code: 'INVALID_CREDENTIAL',
        http: { status: 400 },
      },
    });
  }
}
