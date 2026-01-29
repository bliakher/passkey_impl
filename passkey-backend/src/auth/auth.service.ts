import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/service/user.service';

enum UserRole {
  USER = 'USER',
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
    return await bcrypt.compare(password, user.password);
  }

  async issueAccessToken(user: User): Promise<string> {
    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      role: UserRole.USER,
    });
    return token;
  }

  async issueRefreshToken(user: User): Promise<string> {
    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        tokenVersion: 0, //TODO: add token version to user, revoke refresh tokens
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
    return token;
  }

  async initiateRegistration(
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
        /**
         * Wondering why user verification isn't required? See here:
         *
         * https://passkeys.dev/docs/use-cases/bootstrapping/#a-note-about-user-verification
         */
        userVerification: 'preferred',
      },
      /**
       * Support the two most common algorithms: ES256, and RS256
       */
      supportedAlgorithmIDs: [-7, -257],
    };
    const options = await generateRegistrationOptions(opts);
    return options;
  }

  async saveChallenge(data: AuthChallengeData): Promise<void> {
    await this.dbService.authChallenge.create({
      data: {
        challenge: data.challenge,
        user_id: data.userId,
        username: data.username,
      },
    });
  }
}

export interface AuthChallengeData {
  challenge: string;
  userId: string;
  username: string;
}
