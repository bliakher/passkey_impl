import { gql, type TypedDocumentNode } from '@apollo/client';

type Credential = {
  id: string;
  device: string;
  createdAt: string;
  publicKey: string;
};

type UserQueryData = {
  user: {
    id: string;
    username: string;
    credentials: Credential[];
  };
};

type UserQueryVars = {
  id: string;
};

export const USER_QUERY: TypedDocumentNode<UserQueryData, UserQueryVars> = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      username
      credentials {
        id
        device
        createdAt
        publicKey
      }
    }
  }
`;
