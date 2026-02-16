import { gql, type TypedDocumentNode } from '@apollo/client';

type FinishPasskeyRegistrationData = {
  finishPasskeyRegistration: {
    ok: boolean;
  };
};

type FinishPasskeyRegistrationVars = {
  challengeId: string;
  device: string;
  registrationResponse: Record<string, unknown>;
};

export const FINISH_PASSKEY_REGISTRATION_MUT: TypedDocumentNode<
  FinishPasskeyRegistrationData,
  FinishPasskeyRegistrationVars
> = gql`
  mutation FinishPasskeyRegistration(
    $challengeId: String!
    $device: String!
    $registrationResponse: JSON!
  ) {
    finishPasskeyRegistration(
      challengeId: $challengeId
      device: $device
      registrationResponse: $registrationResponse
    ) {
      ok
    }
  }
`;
