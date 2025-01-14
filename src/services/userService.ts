import { gql } from '@apollo/client';
import client from '../apolloClient';

const LOGIN_MUTATION = gql`
    mutation Login($user: String!, $password: String!) {
        login(usuario: $user, contrasenna: $password) {
        usuario
        id
	    token
        
        }
    }
`;

export const loginUserService = async (user: string, password: string) => {
    try {
        const response = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: { user, password },
        });
        if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Error desconocido');
        }

        return response.data.login;
    } catch (error) {
        console.error(error)
    }
};
