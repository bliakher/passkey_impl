import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Credential } from './credential.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => [Credential])
  credentials: Credential[];
}
