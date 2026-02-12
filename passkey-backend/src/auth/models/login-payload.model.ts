import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class LoginPayload {
  @Field(() => User)
  user: User;

  @Field(() => String)
  accessToken: string;

  @Field(() => Number)
  accessTokenTTLSec: number;

  @Field(() => String)
  refreshToken: string;

  @Field(() => Number)
  refreshTokenTTLSec: number;
}

@ObjectType()
export class RefreshPayload {
  @Field(() => String)
  accessToken: string;

  @Field(() => Number)
  accessTokenTTLSec: number;
}
