import { gql } from '@apollo/client';
import client from '../apolloClient';

export const LIST_DIVISAS_QUERY = gql`
  query ListDivisas {
    listDivisas {
      id
      nombre
      abreviatura
      simbolo
      region
    }
  }
`;

export const ADD_DIVISA_MUTATION = gql`
  mutation AddDivisa($nombre: String!, $abreviatura: String!, $simbolo: String!, $region: String!) {
    addDivisa(nombre: $nombre, abreviatura: $abreviatura, simbolo: $simbolo, region: $region) {
      id
      nombre
      abreviatura
      simbolo
      region
    }
  }
`;

export const UPDATE_DIVISA_MUTATION = gql`
  mutation UpdateDivisa($updateDivisaId: ID!, $nombre: String, $abreviatura: String, $simbolo: String, $region: String) {
    updateDivisa(id: $updateDivisaId, nombre: $nombre, abreviatura: $abreviatura, simbolo: $simbolo, region: $region) {
      id
      nombre
      abreviatura
      simbolo
      region
    }
  }
`;

export const DELETE_DIVISA_MUTATION = gql`
  mutation DeleteDivisa($deleteDivisaId: ID!) {
    deleteDivisa(id: $deleteDivisaId) {
      id
    }
  }
`;

interface AddDivisaInput {
    nombre: string;
    abreviatura: string;
    simbolo: string;
    region: string;
}

interface UpdateDivisaInput {
    updateDivisaId: string;
    nombre?: string;
    abreviatura?: string;
    simbolo?: string;
    region?: string;
}

export const listDivisasService = async () => {
    try {
        const response = await client.query({
            query: LIST_DIVISAS_QUERY,
        });
        if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Error desconocido');
        }
        return response.data.listDivisas;
    } catch (error) {
        console.error('Error al obtener la lista de divisas:', error);
        throw error;
    }
};

export const addDivisaService = async (divisaData: AddDivisaInput) => {
    try {
        const response = await client.mutate({
            mutation: ADD_DIVISA_MUTATION,
            variables: divisaData,
        });
        if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Error desconocido');
        }
        return response.data.addDivisa;
    } catch (error) {
        console.error('Error al crear la divisa:', error);
        throw error;
    }
};

export const updateDivisaService = async (divisaData: UpdateDivisaInput) => {
    try {
        const response = await client.mutate({
            mutation: UPDATE_DIVISA_MUTATION,
            variables: divisaData,
        });
        if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Error desconocido');
        }
        return response.data.updateDivisa;
    } catch (error) {
        console.error('Error al actualizar la divisa:', error);
        throw error;
    }
};

export const deleteDivisaService = async (id: string) => {
    try {
        const response = await client.mutate({
            mutation: DELETE_DIVISA_MUTATION,
            variables: { deleteDivisaId: id },
        });
        if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Error desconocido');
        }
        return response.data.deleteDivisa;
    } catch (error) {
        console.error('Error al eliminar la divisa:', error);
        throw error;
    }
};
