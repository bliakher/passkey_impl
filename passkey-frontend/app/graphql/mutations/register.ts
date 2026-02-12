import { gql } from '@apollo/client';

export const REGISTER_MUT = gql`
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