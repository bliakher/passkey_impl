import * as bcrypt from 'bcrypt';
import moment from 'moment';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthChallenge, User } from '@prisma/client';
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
  RegistrationResponseJSON,
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/service/user.service';

export enum UserRole {
  USER = 'USER',
}

export interface AccessTokenPayload {
  sub: string;
  username: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenVersion: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private dbService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.usersService.getUser({ username });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.usersService.getUser({ id });
  }

  async createUser(username: string, password: string): Promise<User> {
    const hash = await this.hashPassword(password);
    return await this.usersService.createUser({
      username,
      password: hash,
    });
  }

  async hashPassword(password: string): Promise<string> {
    const pepper = process.env.PASSWD_PEPPER;
    if (!pepper) {
      throw new Error('PASSWD_PEPPER is not set');
    }
    const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
    const hash = await bcrypt.hash(password + pepper, saltRounds);
    return hash;
  }

  async verifyPassword(password: string, user: User): Promise<boolean> {
    const pepper = process.env.PASSWD_PEPPER;
    if (!pepper) {
      throw new Error('PASSWD_PEPPER is not set');
    }
    return await bcrypt.compare(password + pepper, user.password);
  }

  async issueAccessToken(user: User): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      username: user.username,
      role: UserRole.USER,
    };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async issueRefreshToken(user: User): Promise<string> {
    const payload: RefreshTokenPayload = {
      sub: user.id,
      tokenVersion: user.tokenVersion,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return token;
  }

  async verifyRefreshToken(token: string): Promise<User | null> {
    const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
      token,
      {
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );

    const user = await this.usersService.getUser({ id: payload.sub });
    if (!user || user.tokenVersion != payload.tokenVersion) {
      return null;
    }
    return user;
  }

  async invalidateRefreshToken(user: User): Promise<void> {
    await this.usersService.updateUserById(user.id, {
      tokenVersion: user.tokenVersion + 1,
    });
  }

  async startPasskeyRegistration(
    username: string,
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const opts: GenerateRegistrationOptionsOpts = {
      rpName: 'Passkeys Test Implementation',
      rpID: 'localhost', //TODO: set up env variable
      userName: username,
      timeout: 60000,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'discouraged',
        userVerification: 'preferred',
      },
      supportedAlgorithmIDs: [-7, -257],
    };
    const options = await generateRegistrationOptions(opts);
    return options;
  }

  async verifyPasskeyRegistration(
    challenge: AuthChallenge,
    registrationResponse: RegistrationResponseJSON,
  ): Promise<VerifiedRegistrationResponse> {
    const result = await verifyRegistrationResponse({
      response: registrationResponse,
      expectedChallenge: challenge.challenge,
      expectedType: 'webauthn.create',
      expectedOrigin: '',
    });
    return result;
  }

  async saveCredential(credData: CredentialData) {
    await this.dbService.credential.create({
      data: {
        id: credData.id,
        public_key: credData.publicKey,
        user_id: credData.userId,
        counter: credData.counter,
        transports: '',
        device: credData.device,
      },
    });
  }

  async saveChallenge(data: AuthChallengeData): Promise<AuthChallenge> {
    const expires = moment().add(5, 'minutes').toDate();
    return await this.dbService.authChallenge.create({
      data: {
        challenge: data.challenge,
        user_id: data.userId,
        username: data.username,
        expires_at: expires,
      },
    });
  }

  async getChallenge(id: string): Promise<AuthChallenge | null> {
    const challenge = await this.dbService.authChallenge.findUnique({
      where: { id },
    });
    // check expiration date
    if (challenge == null || challenge.expires_at > new Date()) return null;

    return challenge;
  }
}

export interface CredentialData {
  id: string;
  userId: string;
  publicKey: Uint8Array<ArrayBuffer>;
  counter: number;
  device?: string;
}

export interface AuthChallengeData {
  challenge: string;
  userId: string;
  username: string;
}
