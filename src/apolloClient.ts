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
