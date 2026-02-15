import { gql, type TypedDocumentNode } from '@apollo/client';

type RefreshMutationData = {
  refresh: {
    accessToken: string;
    accessTokenTTLSec: number;
  };
};

type RefreshMutationVars = {
  refreshToken: string;
};

export const REFRESH_MUT: TypedDocumentNode<RefreshMutationData, RefreshMutationVars> = gql`
  mutation Refresh($refreshToken: String!) {
    refresh(refreshToken: $refreshToken) {
      accessToken
      accessTokenTTLSec
    }
  }
`;
