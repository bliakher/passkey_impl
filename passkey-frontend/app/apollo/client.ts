import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { ServerError } from '@apollo/client/errors';
import { Observable } from 'rxjs';
import { getAccessToken, refreshAccessToken, clearTokens } from '~/lib/auth';

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = new SetContextLink((prevContext) => {
  const token = getAccessToken();

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

let refreshingPromise: Promise<boolean> | null = null;

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  const isAuthError =
    (CombinedGraphQLErrors.is(error) &&
      error.errors.some((err) => err.extensions?.code === 'UNAUTHENTICATED')) ||
    (ServerError.is(error) && error.statusCode === 401);

  if (!isAuthError) return;

  return new Observable((observer) => {
    (async () => {
      try {
        if (!refreshingPromise) {
          refreshingPromise = refreshAccessToken();
        }
        const success = await refreshingPromise;
        refreshingPromise = null;

        if (!success) {
          clearTokens();
          window.location.href = '/login';
          return;
        }

        const oldHeaders = operation.getContext().headers;
        operation.setContext({
          headers: { ...oldHeaders, authorization: `Bearer ${getAccessToken()}` },
        });

        forward(operation).subscribe(observer);
      } catch {
        refreshingPromise = null;
        clearTokens();
        window.location.href = '/login';
      }
    })();
  });
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
