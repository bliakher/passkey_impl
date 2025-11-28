import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Color {
  @Field(() => Int)
  R: number;

  @Field(() => Int)
  G: number;

  @Field(() => Int)
  B: number;
}
