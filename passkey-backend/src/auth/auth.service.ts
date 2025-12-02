import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private dbService: PrismaService,
  ) {}

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.usersService.getUser({ username });
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
