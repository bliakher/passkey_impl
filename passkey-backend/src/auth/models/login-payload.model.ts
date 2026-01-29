import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginPayload {
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
