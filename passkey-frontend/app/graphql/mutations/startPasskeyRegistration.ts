import { gql, type TypedDocumentNode } from '@apollo/client';

type AuthenticatorSelectionDTO = {
  residentKey: string;
  userVerification: string;
};

type PublicKeyParamsDTO = {
  alg: number;
  type: string;
};

type RpEntityDTO = {
  id: string;
  name: string;
};

type UserEntityDTO = {
  displayName: string;
  id: string;
  name: string;
};

type StartPasskeyRegistrationData = {
  startPasskeyRegistration: {
    authenticatorSelection: AuthenticatorSelectionDTO;
    challenge: string;
    challengeId: string;
    pubKeyCredParams: PublicKeyParamsDTO[];
    rp: RpEntityDTO;
    timeout: number;
    user: UserEntityDTO;
  };
};

export const START_PASSKEY_REGISTRATION_MUT: TypedDocumentNode<StartPasskeyRegistrationData> = gql`
  mutation StartPasskeyRegistration {
    startPasskeyRegistration {
      authenticatorSelection {
        residentKey
        userVerification
      }
      challenge
      challengeId
      pubKeyCredParams {
        alg
        type
      }
      rp {
        id
        name
      }
      timeout
      user {
        displayName
        id
        name
      }
    }
  }
`;
