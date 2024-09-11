
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URI,
    cache: new InMemoryCache(),
    // Puedes agregar un link de error para manejar errores de red
    onError: (error) => {
        console.error("Error en Apollo Client:", error);
    }
});



export default client;

/*
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, onError } from '@apollo/client';

// Crear un link para manejar errores
const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (networkError) {
        console.error('Network Error:', networkError);
    }
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
    }
});

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URIS,
});

const client = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client;

*/
