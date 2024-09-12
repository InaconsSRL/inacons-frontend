import { gql } from '@apollo/client';
import client from '../apolloClient'; 

const LOGIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
        login(usuario: $username, contrasenna: $password) {
        usuario
        id
	token
        }
    }
`;

export const loginUserService = async (username: string, password: string) => {
    try {
        const response = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: { username, password },
        });
        if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Error desconocido');
        }

        return response.data.login;
    } catch (error) {
        console.log(error)
    }
};
