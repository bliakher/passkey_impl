import { gql, type TypedDocumentNode } from '@apollo/client';

type LoginMutationData = {
  login: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
    };
  };
};

type LoginMutationVars = {
  username: string;
  password: string;
};

export const LOGIN_MUT: TypedDocumentNode<LoginMutationData, LoginMutationVars> = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
      user {
        id
        username
      }
    }
  }
`;