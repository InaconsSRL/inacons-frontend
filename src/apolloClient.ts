import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error";

// Creamos un link de error
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// Creamos un link HTTP
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
});

// Creamos el cliente Apollo
const client = new ApolloClient({
  link: from([errorLink, httpLink]), // Combinamos los links
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'cache-first', // Cambiado a network-only para asegurar datos frescos
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default client;