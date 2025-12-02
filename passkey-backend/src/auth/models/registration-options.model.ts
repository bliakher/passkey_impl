import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum RequiredLevel {
  Required = 'required',
  Preferred = 'preferred',
  Discouraged = 'discouraged',
}

registerEnumType(RequiredLevel, {
  name: 'RequiredLevel',
  description: 'Is option required as defined by WebAuthn',
});

@ObjectType()
export class RpEntityDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}

@ObjectType()
export class AuthenticatorSelectionDTO {
  @Field(() => RequiredLevel)
  userVerification: RequiredLevel;

  @Field(() => RequiredLevel)
  residentKey: RequiredLevel;
}

@ObjectType()
export class PublicKeyParamsDTO {
  @Field(() => String)
  alg: number;

  @Field(() => Int)
  type: string;
}

@ObjectType()
export class UserEntityDTO {
  @Field(() => String)
  displayName: string;

  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}

@ObjectType()
export class RegistrationOptionsDTO {
  @Field(() => AuthenticatorSelectionDTO)
  authenticatorSelection: AuthenticatorSelectionDTO;

  @Field(() => String)
  challenge: string;

  @Field(() => [PublicKeyParamsDTO])
  pubKeyCredParams: PublicKeyParamsDTO[];

  @Field(() => RpEntityDTO)
  rp: RpEntityDTO;

  @Field(() => Int)
  timeout: number;
}
