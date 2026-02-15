import { gql, type TypedDocumentNode } from '@apollo/client';

type LogoutMutationData = {
  logout: {
    ok: boolean;
  };
};

type LogoutMutationVars = {
  refreshToken: string;
};

export const LOGOUT_MUT: TypedDocumentNode<LogoutMutationData, LogoutMutationVars> = gql`
  mutation Logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken) {
      ok
    }
  }
`;
