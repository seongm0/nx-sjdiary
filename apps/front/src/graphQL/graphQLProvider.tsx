import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useEffect } from 'react';

import { useAuth0 } from '../auth0/auth0Wrapper';
import { SERVER_API_URL } from '../config';

export const GraphQLProvider = ({
  children,
}: {
  // eslint-disable-next-line react/require-default-props
  children?: JSX.Element;
}): JSX.Element => {
  const { getToken, isAuthenticated } = useAuth0();

  const httpLink = new HttpLink({ uri: `${SERVER_API_URL}/graphql` });

  /* istanbul ignore next */
  const authLink = setContext(async () => {
    if (isAuthenticated) {
      const accessToken = await getToken();
      return {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      };
    }
    return {
      headers: {
        authorization: 'Bearer ',
      },
    };
  });

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    name: `web-${process.env.REACT_APP_MODE}`,
  });

  useEffect(() => {
    // * remove all cache on user signout
    if (isAuthenticated === false) {
      apolloClient.clearStore();
    }
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
