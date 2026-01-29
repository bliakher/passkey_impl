import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegistrationOptionsDTO } from './models/registration-options.model';
import { AuthService } from './auth.service';
import {
  LoginFailedError,
  RefreshTokenInvalidError,
  UsernameAlreadyUsedError,
} from './errors/auth.errors';
import { LoginPayload, RefreshPayload } from './models/login-payload.model';
import { MutationResult } from './models/result.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginPayload)
  async register(
    @Args({ name: 'username', type: () => String }) username: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<LoginPayload> {
    const existingUser = await this.authService.getUserByUsername(username);
    if (existingUser != null) {
      throw new UsernameAlreadyUsedError();
    }

    const newUser = await this.authService.createUser(username, password);
    const accessToken = await this.authService.issueAccessToken(newUser);
    const refreshToken = await this.authService.issueRefreshToken(newUser);

    return {
      accessToken: accessToken,
      accessTokenTTLSec: 15 * 60,
      refreshToken: refreshToken,
      refreshTokenTTLSec: 7 * 24 * 60 * 60,
    };
  }

  @Mutation(() => LoginPayload)
  async login(
    @Args({ name: 'username', type: () => String }) username: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<LoginPayload> {
    const user = await this.authService.getUserByUsername(username);
    if (!user) {
      throw new LoginFailedError();
    }

    const valid = await this.authService.verifyPassword(password, user);
    if (!valid) {
      throw new LoginFailedError();
    }
    const accessToken = await this.authService.issueAccessToken(user);
    const refreshToken = await this.authService.issueRefreshToken(user);

    return {
      accessToken: accessToken,
      accessTokenTTLSec: 15 * 60,
      refreshToken: refreshToken,
      refreshTokenTTLSec: 7 * 24 * 60 * 60,
    };
  }

  @Mutation(() => RefreshPayload)
  async refresh(
    @Args({ name: 'refreshToken', type: () => String }) refreshToken: string,
  ): Promise<RefreshPayload> {
    const user = await this.authService.verifyRefreshToken(refreshToken);
    if (!user) {
      throw new RefreshTokenInvalidError();
    }
    const accessToken = await this.authService.issueAccessToken(user);

    return {
      accessToken: accessToken,
      accessTokenTTLSec: 15 * 60,
    };
  }

  @Mutation(() => MutationResult)
  async logout(
    @Args({ name: 'refreshToken', type: () => String }) refreshToken: string,
  ): Promise<MutationResult> {
    const user = await this.authService.verifyRefreshToken(refreshToken);
    if (!user) {
      throw new RefreshTokenInvalidError();
    }

    await this.authService.invalidateRefreshToken(user);
    return {
      ok: true,
    };
  }

  // TODO: verify authentication
  @Mutation(() => RegistrationOptionsDTO)
  async startPasskeyRegistration(
    @Args({ name: 'username', type: () => String }) username: string,
  ) {
    const user = await this.authService.getUserByUsername(username);
    if (user != null) {
      throw new UsernameAlreadyUsedError();
    }

    const options = await this.authService.initiateRegistration(username);

    await this.authService.saveChallenge({
      challenge: options.challenge,
      userId: options.user.id,
      username: options.user.name,
    });

    return options;
  }
}
