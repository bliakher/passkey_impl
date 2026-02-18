import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserInfo {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username: string;
}

@ObjectType()
export class LoginPayload {
  @Field(() => UserInfo)
  user: UserInfo;

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
