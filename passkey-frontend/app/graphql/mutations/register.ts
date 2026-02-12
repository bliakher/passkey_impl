import { gql, type TypedDocumentNode } from '@apollo/client';

type RegisterMutationData = {
  register: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
    };
  };
};

type RegisterMutationVars = {
  username: string;
  password: string;
};

export const REGISTER_MUT: TypedDocumentNode<RegisterMutationData, RegisterMutationVars> = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      accessToken
      refreshToken
      user {
        id
        username
      }
    }
  }
`;