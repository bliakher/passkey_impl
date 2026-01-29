import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MutationResult {
  @Field(() => Boolean)
  ok: boolean;
}
