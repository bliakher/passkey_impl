import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RegistrationOptionsDTO } from './models/registration-options.model';
import { AuthService } from './auth.service';
import { UsernameAlreadyUsedError } from './errors/auth.errors';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

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
