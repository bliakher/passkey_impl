import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Credential {
  @Field(() => String)
  id: string;

  @Field(() => String)
  device: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  publicKey: string;
}
