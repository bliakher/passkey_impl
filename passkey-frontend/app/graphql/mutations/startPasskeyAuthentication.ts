import { gql, type TypedDocumentNode } from '@apollo/client';

type CredentialDTO = {
  id: string;
  transports: string[];
  type: string;
};

type StartPasskeyAuthenticationData = {
  startPasskeyAuthentication: {
    challengeId: string;
    allowCredentials: CredentialDTO[];
    challenge: string;
    rpId: string;
    timeout: number;
    userVerification: string;
  };
};

type StartPasskeyAuthenticationVars = {
  username: string;
};

export const START_PASSKEY_AUTHENTICATION_MUT: TypedDocumentNode<
  StartPasskeyAuthenticationData,
  StartPasskeyAuthenticationVars
> = gql`
  mutation StartPasskeyAuthentication($username: String!) {
    startPasskeyAuthentication(username: $username) {
      challengeId
      allowCredentials {
        id
        transports
        type
      }
      challenge
      rpId
      timeout
      userVerification
    }
  }
`;
