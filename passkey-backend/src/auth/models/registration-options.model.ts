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
  @Field(() => Int)
  alg: number;

  @Field(() => String)
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
export class CredentialDTO {
  @Field(() => String)
  id: string;

  @Field(() => [String])
  transports?: string[];

  @Field(() => String)
  type: string;
}

@ObjectType()
export class RegistrationOptionsDTO {
  @Field(() => String)
  challengeId: string;

  @Field(() => String)
  challenge: string;

  @Field(() => RpEntityDTO)
  rp: RpEntityDTO;

  @Field(() => UserEntityDTO)
  user: UserEntityDTO;

  @Field(() => Int)
  timeout: number;

  @Field(() => AuthenticatorSelectionDTO)
  authenticatorSelection: AuthenticatorSelectionDTO;

  @Field(() => [PublicKeyParamsDTO])
  pubKeyCredParams: PublicKeyParamsDTO[];
}

@ObjectType()
export class SuccessResult {
  @Field(() => Boolean)
  ok: boolean;
}

@ObjectType()
export class AuthenticationOptionsDTO {
  @Field(() => String)
  rpId: string;

  @Field(() => String)
  challenge: string;

  @Field(() => [CredentialDTO])
  allowCredentials: CredentialDTO[];

  @Field(() => Int)
  timeout: number;

  @Field(() => RequiredLevel)
  userVerification: RequiredLevel;
}
