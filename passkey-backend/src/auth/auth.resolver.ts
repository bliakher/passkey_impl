import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  AuthenticationOptionsDTO,
  RegistrationOptionsDTO,
  SuccessResult,
} from './models/registration-options.model';
import { AuthService } from './service/auth.service';
import {
  LoginFailedError,
  RefreshTokenInvalidError,
  PasskeyRegistrationVerificationFailed,
  InvalidChallengeError,
  InvalidCredentialIdError,
} from './errors/auth.errors';
import { LoginPayload, RefreshPayload } from './models/login-payload.model';
import { MutationResult } from './models/result.model';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { InvalidUsernameError } from './errors/user.errors';
import GraphQLJSON from 'graphql-type-json';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { CurrentUser, GqlJwtAuthGuard } from './service/gql-auth-guard';
import type { UserData } from './service/jwt-startegy';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginPayload)
  async register(
    @Args({ name: 'username', type: () => String }) username: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<LoginPayload> {
    const existingUser = await this.authService.getUserByUsername(username);
    console.log('registration - existing user:', existingUser);
    if (existingUser != null) {
      throw new LoginFailedError();
    }

    const newUser = await this.authService.createUser(username, password);
    const accessToken = await this.authService.issueAccessToken(newUser);
    const refreshToken = await this.authService.issueRefreshToken(newUser);

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
      },
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
      user: {
        id: user.id,
        username: user.username,
      },
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
    console.log('Successful refresh, new token:', accessToken);

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

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => RegistrationOptionsDTO)
  async startPasskeyRegistration(@CurrentUser() userData: UserData) {
    const user = await this.authService.getUserById(userData.userId);
    if (user == null) {
      throw new InvalidUsernameError();
    }

    const options = await this.authService.startPasskeyRegistration(
      user.id,
      user.username,
    );
    console.log('registration options:', options);

    const challenge = await this.authService.saveChallenge({
      challenge: options.challenge,
      userId: options.user.id,
      username: options.user.name,
    });

    return {
      challengeId: challenge.id,
      ...options,
    };
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => SuccessResult)
  async finishPasskeyRegistration(
    @CurrentUser() userData: UserData,
    @Args({ name: 'registrationResponse', type: () => GraphQLJSON })
    registrationResponse: RegistrationResponseJSON,
    @Args({ name: 'challengeId', type: () => String })
    challengeId: string,
    @Args({ name: 'device', type: () => String })
    device: string,
  ): Promise<SuccessResult> {
    const user = await this.authService.getUserById(userData.userId);
    if (user == null) {
      throw new InvalidUsernameError();
    }
    const challenge = await this.authService.getChallenge(challengeId);
    if (challenge == null) {
      throw new InvalidChallengeError();
    }
    const verifyRes = await this.authService.verifyPasskeyRegistration(
      challenge,
      registrationResponse,
    );
    if (!verifyRes.verified) {
      throw new PasskeyRegistrationVerificationFailed();
    }

    await this.authService.saveCredential({
      userId: user.id,
      id: verifyRes.registrationInfo.credential.id,
      publicKey: verifyRes.registrationInfo.credential.publicKey,
      counter: verifyRes.registrationInfo.credential.counter,
      transports: verifyRes.registrationInfo.credential.transports,
      device,
    });

    return {
      ok: true,
    };
  }

  @Mutation(() => AuthenticationOptionsDTO)
  async startPasskeyAuthentication(
    @Args({ name: 'username', type: () => String }) username: string,
  ) {
    const user = await this.authService.getUserWithCredentials(username);
    if (!user) {
      throw new LoginFailedError();
    }
    console.log(user.credentials);
    //TODO: save transports correctly
    const options = await this.authService.startPasskeyAuthentication(
      user.credentials,
    );
    console.log('Passkey authentication options:', options);
    const challenge = await this.authService.saveChallenge({
      challenge: options.challenge,
      username,
    });

    return {
      challengeId: challenge.id,
      ...options,
    };
  }

  @Mutation(() => LoginPayload)
  async finishPasskeyAuthentication(
    @Args({ name: 'challengeId', type: () => String }) challengeId: string,
    @Args({ name: 'authenticationResponse', type: () => GraphQLJSON })
    authenticationResponse: AuthenticationResponseJSON,
  ) {
    const challenge = await this.authService.getChallenge(challengeId);
    if (challenge == null) {
      throw new InvalidChallengeError();
    }
    const credentialId = authenticationResponse.id;
    const credential = await this.authService.getCredentialById(credentialId);
    if (credential == null) {
      throw new InvalidCredentialIdError();
    }
    const result = await this.authService.verifyPasskeyAuthentication(
      challenge,
      credential,
      authenticationResponse,
    );
    if (!result.verified) {
      throw new LoginFailedError();
    }
    const user = await this.authService.getUserById(credential.user_id);
    if (user == null) {
      throw new InternalServerErrorException(
        'Credential connected to unknown user ID',
      );
    }
    const accessToken = await this.authService.issueAccessToken(user);
    const refreshToken = await this.authService.issueRefreshToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      accessToken: accessToken,
      accessTokenTTLSec: 15 * 60,
      refreshToken: refreshToken,
      refreshTokenTTLSec: 7 * 24 * 60 * 60,
    };
  }
}
