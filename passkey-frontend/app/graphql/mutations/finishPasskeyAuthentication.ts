import { gql, type TypedDocumentNode } from '@apollo/client';

type FinishPasskeyAuthenticationData = {
  finishPasskeyAuthentication: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
    };
  };
};

type FinishPasskeyAuthenticationVars = {
  challengeId: string;
  authenticationResponse: Record<string, unknown>;
};

export const FINISH_PASSKEY_AUTHENTICATION_MUT: TypedDocumentNode<
  FinishPasskeyAuthenticationData,
  FinishPasskeyAuthenticationVars
> = gql`
  mutation FinishPasskeyAuthentication(
    $challengeId: String!
    $authenticationResponse: JSON!
  ) {
    finishPasskeyAuthentication(
      challengeId: $challengeId
      authenticationResponse: $authenticationResponse
    ) {
      accessToken
      refreshToken
      user {
        id
        username
      }
    }
  }
`;
